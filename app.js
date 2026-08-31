const map={fName:'pName',fTitle:'pTitle',fSubtitle:'pSubtitle',fBase:'pBase',fDynamic:'pDynamic',fCareer:'pCareer',fRelations:'pRelations',fDecisions:'pDecisions'};
const defaults={};
for(const [inputId,outputId] of Object.entries(map)){
  const input=document.getElementById(inputId), output=document.getElementById(outputId);
  defaults[inputId]=input.value;
  const sync=()=>output.textContent=input.value.trim()||'—';
  input.addEventListener('input',sync); sync();
}
document.getElementById('printBtn').addEventListener('click',()=>window.print());
document.getElementById('resetBtn').addEventListener('click',()=>{
  for(const [inputId] of Object.entries(map)){
    const el=document.getElementById(inputId); el.value=defaults[inputId]; el.dispatchEvent(new Event('input'));
  }
});
