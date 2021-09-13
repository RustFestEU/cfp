export function collect(element) {
  if (!element?.querySelectorAll) return '';

  let s = '# EXPORTED PROPOSAL - RustFest Global 2021\n'
    +'## '+new Date().toLocaleString()+'\n'
    +'## '+window.location.href+'\n'
    +'\n'
    +Array.from(element.querySelectorAll('[data-ptx]'))
      .map(e => e.dataset.ptx)
      .join('\n\n')

    return s;
};

export function ptxString(s) {
  return typeof s === 'string' ? JSON.stringify(s.trim()) : '';
};

export function ptxText(s) {
  return '"""\n' +(s??'').trim()+ '\n"""'
};

// TODO: https://github.com/eligrey/FileSaver.js/
export async function downloadPortatext(element) {
  const d = 'data:text/plain,'+encodeURIComponent(collect(element));

  const a = document.createElement('a')
  a.href = d
  a.download = 'Proposal_RustFest_Global_2021.toml'
  a.rel = 'noopener'
  a.dispatchEvent(new MouseEvent('click'))
};

export async function uploadPortatext(callback) {
  let fileInput, fileReader;

  // Simulate a file input click
  try {
    await new Promise((resolve, reject) => {
      fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.style.opacity = 0;
      document.body.appendChild(fileInput);

      // Open the file input
      fileInput.click();

      // Check if the file input was closed without selecting any files (cancel)
      window.addEventListener(
        'focus',
        () => setTimeout(
          () => {
            if (fileInput.files.length === 0) {
              console.log('Cancelled.');
              fileInput.remove();
              reject();
            } else {
              resolve();
            }
          },
          100),
        { once: true }
      );

    });
  }
  catch(e) {
    return;
  }

  // Read the contents of the file selected
  await new Promise((resolve, reject) => {
    fileReader = new FileReader();
    fileReader.addEventListener('loadend', resolve);
    fileReader.readAsText(fileInput.files[0]);
  });

  // Remove input
  fileInput.remove();

  let multi = false;
  let multitext = '';
  let importdata = [];
  fileReader.result.split('\n').filter(ln => ln.startsWith('#') === false).forEach(ln => {
    let l = ln.trim();
    if (l.endsWith('"""')) {
      let kv;
      if (multi) {
        kv = [multi,multitext.join('\n').trim()];
        multi = '';
      } else {
        multi = l.match(/^\S+/)?.[0];
        multitext = []
      }
      if (kv) importdata.push(kv);
    } else {
      let kv;
      if (!multi) {
        if (l.trim() !== '') {
          // Line-ending comments
          l = l.replace(/\s*#[^"]+$/,'');

          // Parse key-value
          kv = l.match(/^(\S+) = (".+")$/);
        }
      } else {
        // Multiline-string line
        multitext.push(l);
      }
      if (kv) importdata.push([kv[1],JSON.parse(kv[2])]);
    }
  })

  // Pass the imported data back to the CFP form for merging
  const importedSubmission = Object.fromEntries(importdata);
  callback(importedSubmission);
}