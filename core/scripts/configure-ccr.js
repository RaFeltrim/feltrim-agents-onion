const fs = require('fs');
const path = require('path');
const os = require('os');

// Obter modelo dos argumentos ou padrao (gemini-3.5-flash para maxima estabilidade)
const targetModel = process.argv[2] || 'gemini-3.5-flash';


// Carregar .env
const envPath = path.resolve('.env');
let apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

if (!apiKey && fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const geminiMatch = envContent.match(/^GEMINI_API_KEY=(.+)$/m);
  const googleMatch = envContent.match(/^GOOGLE_API_KEY=(.+)$/m);
  if (geminiMatch) apiKey = geminiMatch[1].trim();
  else if (googleMatch) apiKey = googleMatch[1].trim();
}

if (!apiKey) {
  console.error('ERRO: GEMINI_API_KEY ou GOOGLE_API_KEY nao encontrada no .env');
  process.exit(1);
}

const ccrDir = path.join(os.homedir(), '.claude-code-router');
if (!fs.existsSync(ccrDir)) {
  fs.mkdirSync(ccrDir, { recursive: true });
}

const isLocal = targetModel.startsWith('qwen');
const defaultProv = isLocal ? 'lmstudio-provider' : 'gemini-provider';

const config = {
  server: {
    port: 3456,
    host: '127.0.0.1'
  },
  routing: {
    rules: {
      default: {
        provider: defaultProv,
        model: targetModel
      },
      background: {
        provider: 'gemini-provider',
        model: 'gemini-3.5-flash-lite'
      },
      longcontext: {
        provider: 'gemini-provider',
        model: 'gemini-3.5-flash-lite'
      },
      search: {
        provider: 'gemini-provider',
        model: 'gemini-3.5-flash-lite'
      },
      thinking: {
        provider: defaultProv,
        model: targetModel
      }
    },
    defaultProvider: defaultProv,
    providers: {
      'lmstudio-provider': {
        type: 'openai',
        endpoint: 'http://127.0.0.1:1234/v1/chat/completions',
        authentication: {
          type: 'bearer',
          credentials: {
            apiKey: 'lmstudio'
          }
        },
        settings: {
          categoryMappings: {
            default: true,
            thinking: true
          },
          models: [
            'qwen2.5-coder-7b-instruct',
            'qwen3.8-9b-distill',
            'qwen3-8b'
          ],
          defaultModel: isLocal ? targetModel : 'qwen2.5-coder-7b-instruct'
        }
      },
      'gemini-provider': {
        type: 'openai',
        endpoint: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
        authentication: {
          type: 'bearer',
          credentials: {
            apiKey: apiKey
          }
        },
        settings: {
          categoryMappings: {
            default: true,
            background: true,
            thinking: true,
            longcontext: true,
            search: true
          },
          models: [
            'gemini-3.5-flash-lite',
            'gemini-3.5-flash',
            'gemini-2.5-flash'
          ],
          defaultModel: isLocal ? 'gemini-3.5-flash-lite' : targetModel
        }
      }
    }
  },
  debug: {
    enabled: false,
    logLevel: 'info',
    traceRequests: false,
    saveRequests: false
  }
};

const configPath = path.join(ccrDir, 'config-router.json');
fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
console.log(`[CCR] Configuracao Hibrida atualizada em ${configPath}:`);
console.log(`      Agente Principal: ${targetModel} (${defaultProv})`);
console.log(`      Agente /btw & Analisador: gemini-3.5-flash-lite (gemini-provider - 0% RAM/VRAM)`);
