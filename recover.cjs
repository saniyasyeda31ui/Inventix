const fs = require('fs');
const path = require('path');

const brainDir = 'C:/Users/syed saniya/.gemini/antigravity-ide/brain';
const folders = fs.readdirSync(brainDir).filter(f => !f.includes('tempmediaStorage'));

for (const folder of folders) {
  const transcriptPath = path.join(brainDir, folder, '.system_generated', 'logs', 'transcript_full.jsonl');
  if (fs.existsSync(transcriptPath)) {
    const lines = fs.readFileSync(transcriptPath, 'utf8').split('\n');
    for (const line of lines) {
      if (!line) continue;
      let obj;
      try { obj = JSON.parse(line); } catch(e) { continue; }
      
      if (obj.tool_calls) {
        for (const call of obj.tool_calls) {
          if (call.function && call.function.arguments) {
            let args;
            try { args = JSON.parse(call.function.arguments); } catch (e) { continue; }
            
            if (args.TargetFile && args.TargetFile.includes('src/hooks/use')) {
                if (call.function.name === 'default_api:multi_replace_file_content') {
                  console.log(`\n\n--- FOUND EDIT in ${folder} for ${args.TargetFile} ---`);
                  console.log(JSON.stringify(args.ReplacementChunks, null, 2).slice(0, 500) + '...');
                }
            }
          }
        }
      }
    }
  }
}
