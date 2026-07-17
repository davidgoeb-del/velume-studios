const fs = require('fs');

const filesToPatch = [
  'american-life-moments/assets/index-CCDeZlNV.js',
  'lumora-american-cafe-culture/assets/index-RRGbEoyW.js'
];

const replacements = [
  {
    from: 'className:"level-card p-8 sm:p-10 border rounded-[32px] cursor-pointer hover:scale-[1.01] hover:shadow-md active:scale-[0.99] transition-all duration-300 flex flex-col justify-between text-left group/level"',
    to: 'className:"level-card p-6 sm:p-7 border rounded-[28px] cursor-pointer hover:scale-[1.01] hover:shadow-md active:scale-[0.99] transition-all duration-300 flex flex-col justify-between text-left group/level"'
  },
  {
    from: 'className:"flex items-start justify-between gap-4 mb-6"',
    to: 'className:"flex items-start justify-between gap-4 mb-3"'
  },
  {
    from: 'className:"font-sans text-stone-600 text-[15px] sm:text-[16px] leading-relaxed mt-3.5 font-normal"',
    to: 'className:"font-sans text-stone-600 text-[15px] sm:text-[16px] leading-relaxed mt-2 font-normal"'
  },
  {
    from: 'className:"font-sans text-stone-400 text-[14px] sm:text-[15px] leading-relaxed mt-1.5 font-normal italic border-t border-stone-200/30 pt-3"',
    to: 'className:"font-sans text-stone-400 text-[14px] sm:text-[15px] leading-relaxed mt-1.5 font-normal italic border-t border-stone-200/30 pt-2.5"'
  },
  {
    from: 'className:"mt-6 border-t border-stone-200/40 pt-5 font-sans select-none"',
    to: 'className:"mt-4 border-t border-stone-200/40 pt-4 font-sans select-none"'
  }
];

filesToPatch.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    let patched = content;
    replacements.forEach(r => {
      patched = patched.split(r.from).join(r.to);
    });
    if (patched !== content) {
      fs.writeFileSync(file, patched, 'utf8');
      console.log(`Patched ${file}`);
    } else {
      console.log(`No changes made to ${file}`);
    }
  } else {
    console.log(`${file} not found`);
  }
});
