document.addEventListener('DOMContentLoaded', () => {
  const pillCcr = document.getElementById('pill-ccr');
  const pillLms = document.getElementById('pill-lms');
  const btnRunTests = document.getElementById('btn-run-tests');
  
  const valActiveModel = document.getElementById('val-active-model-name');
  const badgeActiveProvider = document.getElementById('badge-active-provider');
  const valContextWindow = document.getElementById('val-context-window');
  
  const valVramUsed = document.getElementById('val-vram-used');
  const barVramFill = document.getElementById('bar-vram-fill');
  const valVramPercent = document.getElementById('val-vram-percent');
  const valVramFree = document.getElementById('val-vram-free');
  const badgeGpuTemp = document.getElementById('badge-gpu-temp');

  const valRamUsed = document.getElementById('val-ram-used');
  const barRamFill = document.getElementById('bar-ram-fill');
  const valRamPercent = document.getElementById('val-ram-percent');
  const valRamFree = document.getElementById('val-ram-free');

  const modelsGrid = document.getElementById('models-grid-container');
  const badgeFleetCount = document.getElementById('badge-fleet-count');
  const lastUpdated = document.getElementById('last-updated');
  const terminalOutput = document.getElementById('terminal-output');
  const badgeTestStatus = document.getElementById('badge-test-status');

  async function fetchTelemetry() {
    try {
      const res = await fetch('/api/telemetry');
      if (!res.ok) return;
      const data = await res.json();

      // 1. Status Pills
      if (data.services) {
        if (data.services.ccr) {
          pillCcr.className = `pill ${data.services.ccr.online ? 'online' : 'offline'}`;
        }
        if (data.services.lms) {
          pillLms.className = `pill ${data.services.lms.online ? 'online' : 'offline'}`;
        }
      }

      // 2. Active Model
      if (data.activeModel) {
        valActiveModel.textContent = data.activeModel.id || 'Nenhum';
        badgeActiveProvider.textContent = data.activeModel.providerName || 'Local';
        
        const isGemini = (data.activeModel.id || '').startsWith('gemini');
        valContextWindow.textContent = isGemini ? '1,000,000 tokens' : '32,768 tokens';
      }

      // 3. GPU VRAM
      if (data.hardware && data.hardware.gpu) {
        const gpu = data.hardware.gpu;
        valVramUsed.textContent = gpu.usedMb.toLocaleString();
        const vramPct = Math.round((gpu.usedMb / gpu.totalMb) * 100);
        barVramFill.style.width = `${vramPct}%`;
        valVramPercent.textContent = `${vramPct}% Ocupado`;
        valVramFree.textContent = `${gpu.freeMb.toLocaleString()} MB Livres`;
        badgeGpuTemp.textContent = `${gpu.tempC}°C`;
      }

      // 4. System RAM
      if (data.hardware && data.hardware.ram) {
        const ram = data.hardware.ram;
        valRamUsed.textContent = ram.usedGb;
        barRamFill.style.width = `${ram.percent}%`;
        valRamPercent.textContent = `${ram.percent}% em Uso`;
        valRamFree.textContent = `${ram.freeGb} GB Livres`;
      }

      // 5. Models Fleet
      if (data.models && data.models.length > 0) {
        badgeFleetCount.textContent = `${data.models.length} Modelos Prontos`;
        renderModels(data.models, data.activeModel?.id, data.loadedInGpu || []);
      }

      lastUpdated.textContent = `Última sincronização: ${new Date().toLocaleTimeString()}`;
    } catch (err) {
      console.warn('Falha na telemetria:', err);
    }
  }

  function renderModels(models, activeId, loadedInGpu = []) {
    modelsGrid.innerHTML = '';
    models.forEach(m => {
      const isActive = m.id === activeId;
      const isResidentInGpu = loadedInGpu.includes(m.id);
      const card = document.createElement('div');
      card.className = `model-card ${isActive ? 'is-active' : ''}`;
      
      let badgeText = `${m.ms || 0}ms`;
      let badgeClass = '';
      if (isActive) {
        badgeText = 'SESSÃO ATIVA';
        badgeClass = 'badge-emerald';
      } else if (isResidentInGpu) {
        badgeText = '🔥 VRAM ATIVA';
        badgeClass = 'active-badge';
      }

      card.innerHTML = `
        <div class="model-card-header">
          <div class="model-title">${m.id}</div>
          <span class="badge ${badgeClass}">${badgeText}</span>
        </div>
        <div class="model-meta">
          <div>Provedor: <strong>${m.providerName}</strong></div>
          <div>Endpoint: <small>${m.provider === 'lmstudio' ? '127.0.0.1:1234' : 'Google Cloud'}</small></div>
        </div>
        <button class="btn-activate" ${isActive ? 'disabled' : ''} data-id="${m.id}">
          ${isActive ? '✓ Em Execução' : 'Ativar Modelo'}
        </button>
      `;

      const btn = card.querySelector('.btn-activate');
      if (!isActive) {
        btn.addEventListener('click', async () => {
          btn.textContent = 'Ativando...';
          btn.disabled = true;
          try {
            const resp = await fetch('/api/set-active-model', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ modelId: m.id })
            });
            if (resp.ok) {
              fetchTelemetry();
            }
          } catch (e) {
            alert('Falha ao ativar modelo: ' + e.message);
          }
        });
      }

      modelsGrid.appendChild(card);
    });
  }

  // Executar Testes SDET
  btnRunTests.addEventListener('click', async () => {
    btnRunTests.disabled = true;
    btnRunTests.innerHTML = '<span>⏳ Executando SDET Suite...</span>';
    terminalOutput.textContent = '⏳ Executando bateria de 22 testes SDET em segundo plano via test-onion.cmd...\n';
    
    try {
      const res = await fetch('/api/run-tests', { method: 'POST' });
      const data = await res.json();
      terminalOutput.textContent = data.output || 'Testes concluídos.';
      
      if (data.success) {
        badgeTestStatus.className = 'badge badge-emerald';
        badgeTestStatus.textContent = '22/22 Testes Aprovados (100%)';
      } else {
        badgeTestStatus.className = 'badge';
        badgeTestStatus.textContent = 'Falha nos Testes';
      }
    } catch (err) {
      terminalOutput.textContent = 'Erro de comunicação ao executar testes: ' + err.message;
    } finally {
      btnRunTests.disabled = false;
      btnRunTests.innerHTML = '<span>🧪 Executar Testes SDET</span>';
    }
  });

  // Polling a cada 2.5s
  fetchTelemetry();
  setInterval(fetchTelemetry, 2500);
});
