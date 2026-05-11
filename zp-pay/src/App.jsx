import { useState } from "react";

const G={bg:"#1e0f06",bgSection:"#160b04",card:"#2a1508",cardHov:"#351c0a",gold:"#d4a96a",goldL:"#e8c99a",goldD:"#8c5f20",text:"#f5ede3",sub:"#b8957a",muted:"#7a5540",err:"#e05555",ok:"#4db87a",bdr:"#3d1f0d",inp:"#180a04",inpBdr:"#4a2818"};
const L={bg:"#faf5ee",bgAlt:"#f2ebe0",bgDark:"#1a0800",card:"#ffffff",text:"#1a0800",sub:"#5a6a82",subWarm:"#7a5a3a",gold:"#c8873a",goldD:"#8c5f20",bdr:"#e4d4bc",bdrCard:"#ece4d8",btn:"#1a0800",badge:"#f0e4d4",badgeText:"#8c6040",err:"#e05555",ok:"#4db87a",inp:"#fdf9f5",inpBdr:"#d4bfa0"};

const brl=v=>(v||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const maskMoney=s=>{const n=s.replace(/\D/g,"");if(!n)return"";return(parseInt(n)/100).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});};
const parseMoney=s=>parseFloat((s||"").replace(/[^\d,]/g,"").replace(",","."))||0;
const maskTel=s=>{const d=s.replace(/\D/g,"").slice(0,11);if(d.length===11)return`(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;if(d.length>=6)return`(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`;if(d.length>=3)return`(${d.slice(0,2)}) ${d.slice(2)}`;return d;};
const maskCPF=s=>{const d=s.replace(/\D/g,"").slice(0,11);return d.replace(/(\d{3})(\d{0,3})(\d{0,3})(\d{0,2})/,"$1.$2.$3-$4").replace(/\.+$/,"").replace(/-$/,"");};
const maskCEP=s=>{const d=s.replace(/\D/g,"").slice(0,8);return d.replace(/(\d{5})(\d{0,3})/,"$1-$2").replace(/-$/,"");};
const maskCNPJ=s=>{const d=s.replace(/\D/g,"").slice(0,14);return d.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/,"$1.$2.$3/$4-$5").replace(/[./-]+$/,"");};
const pmtPrice=(pv,rPct,n)=>{const r=rPct/100;if(!r)return pv/n;return(pv*r*(1+r)**n)/((1+r)**n-1);};

const RATES={cgi_pf:1.29,cgi_pj:1.49,cgv_pf:1.89,cgv_pj:1.99,fgts:1.8,conta_luz:3.49,pessoal:4.5,recebiveis:2.0,capital_giro:2.5,fin_imovel:0.79,fin_veiculo:1.49};
const COMPANHIAS=["CELPE (Pernambuco)","COELBA (Bahia)","COSERN (Rio Grande do Norte)","ENEL (Ceará)","ENEL (Rio de Janeiro)","ENEL (São Paulo)","CPFL (São Paulo)","RGE (Rio Grande do Sul)","Elektro (litoral SP/RJ)"];
const BANCOS=["Banco do Brasil","Caixa Econômica Federal","Bradesco","Itaú","Santander","Nubank","BTG Pactual","Sicoob","Sicredi","Inter","C6 Bank","PicPay","Mercado Pago","Original","Safra","BNB","BRB","Banrisul"];
const UFS="AC AL AM AP BA CE DF ES GO MA MG MS MT PA PB PE PI PR RJ RN RO RR RS SC SE SP TO".split(" ");
const CATS={pf:{label:"Crédito Pessoa Física",products:[{id:"cgi_pf",label:"Empréstimo com Garantia de Imóvel"},{id:"cgv_pf",label:"Empréstimo com Garantia de Veículo"},{id:"fgts",label:"Antecipação de Saque Aniversário FGTS"},{id:"conta_luz",label:"Empréstimo na Conta de Luz"},{id:"pessoal",label:"Empréstimo Pessoal"}]},pj:{label:"Crédito Pessoa Jurídica",products:[{id:"cgi_pj",label:"Empréstimo com Garantia de Imóvel"},{id:"cgv_pj",label:"Empréstimo com Garantia de Veículo"},{id:"recebiveis",label:"Antecipação de Recebíveis"},{id:"capital_giro",label:"Capital de Giro"}]},fin:{label:"Financiamentos",products:[{id:"fin_imovel",label:"Financiamento Imobiliário"},{id:"fin_veiculo",label:"Financiamento de Veículo"}]},sim:{label:"Simulador",products:[]}};
const STEP_LABELS={operacao:"Operação",op_veiculo:"Veículo",fgts_check:"FGTS",dados_empresa:"Empresa",dados_socios:"Sócios",atividade_faturamento:"Faturamento",dados_pessoais:"Dados Pessoais",endereco_garantia:"End. Garantia",endereco_residencial:"End. Residencial",renda:"Renda",retorno:"Retorno",dados_bancarios:"Banco",docs_pessoais:"Documentos",docs_imovel:"Docs Imóvel",docs_veiculo:"Docs Veículo",confirmacao:"Finalização",op_capital:"Operação",op_recebiveis:"Recebíveis"};
const FAQS=[{q:"A simulação tem algum custo?",a:"Não. A simulação é totalmente gratuita e sem compromisso. Você pode simular quantas vezes quiser, sem pagar nada."},{q:"A simulação garante a aprovação do crédito?",a:"Não. A simulação mostra uma estimativa das condições com base nos dados informados. A aprovação depende da análise de crédito pelas instituições parceiras."},{q:"Quanto tempo leva para simular?",a:"Apenas 2 a 3 minutos. Basta preencher as informações do produto escolhido e você verá os resultados imediatamente."},{q:"Preciso enviar documentos para simular?",a:"Não. Para simular não é necessário nenhum documento. Os documentos são solicitados apenas na etapa de contratação."},{q:"Os valores da simulação são exatos?",a:"São estimativas baseadas em taxas indicativas. A taxa real e as condições finais são definidas após a análise de crédito completa."},{q:"Preciso ter conta em algum banco específico?",a:"Não. Trabalhamos com diversas instituições parceiras e o crédito pode ser direcionado para qualquer conta bancária em seu nome."},{q:"Quanto tempo leva para ter a resposta da análise?",a:"Nossa equipe retorna em até 48 horas úteis após o envio completo da proposta e da documentação."},{q:"Quais documentos são necessários?",a:"Em geral: RG ou CNH, CPF, comprovante de endereço, comprovante de renda e documentação do bem dado em garantia. Varia conforme o produto."},{q:"Posso usar o imóvel como garantia mesmo financiado?",a:"Depende do saldo devedor e do valor do imóvel. Em alguns casos é possível — nossa equipe avalia cada situação individualmente."}];

function Ico({n,s=18,c="currentColor",sw=1.8}){
  const p={width:s,height:s,viewBox:"0 0 24 24",fill:"none",stroke:c,strokeWidth:sw,strokeLinecap:"round",strokeLinejoin:"round"};
  if(n==="check")return <svg {...p}><polyline points="20 6 9 17 4 12"/></svg>;
  if(n==="arrow")return <svg {...p}><path d="M5 12h14M13 5l7 7-7 7"/></svg>;
  if(n==="chev")return <svg {...p}><polyline points="9 6 15 12 9 18"/></svg>;
  if(n==="user")return <svg {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
  if(n==="building")return <svg {...p}><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M9 7h.01M9 11h.01M9 15h.01M14 7h.01M14 11h.01M14 15h.01"/></svg>;
  if(n==="bank")return <svg {...p}><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/></svg>;
  if(n==="calc")return <svg {...p}><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/></svg>;
  if(n==="shield")return <svg {...p}><path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z"/><path d="M9 12l2 2 4-4"/></svg>;
  if(n==="zap")return <svg {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
  if(n==="phone")return <svg {...p}><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M11 18h2"/></svg>;
  if(n==="chat")return <svg {...p}><path d="M21 11a8 8 0 0 1-3 6.2L19 22l-5-2a8 8 0 1 1 7-9z"/></svg>;
  if(n==="chart")return <svg {...p}><path d="M3 3v18h18M7 14l4-4 4 4 5-5"/></svg>;
  if(n==="hand")return <svg {...p}><path d="M9 11V6a2 2 0 0 1 4 0v5M13 11V4a2 2 0 0 1 4 0v9M17 11V8a2 2 0 0 1 4 0v9a6 6 0 0 1-6 6h-2c-2.5 0-4-1-5-2l-4-7c-1-2 1-3 2-2l3 3"/></svg>;
  if(n==="warn")return <svg {...p}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
  if(n==="lock")return <svg {...p}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
  if(n==="doc")return <svg {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M8 13h8M8 17h8M8 9h2"/></svg>;
  if(n==="dot")return <svg {...p} fill={c} stroke="none"><circle cx="12" cy="12" r="4"/></svg>;
  return null;
}

function getContractSteps(product){
  const steps=[];
  if(["cgi_pf","cgi_pj","fin_imovel"].includes(product))steps.push("operacao");
  if(["cgv_pf","cgv_pj","fin_veiculo"].includes(product))steps.push("op_veiculo");
  if(product==="fgts")steps.push("fgts_check");
  if(product==="capital_giro")steps.push("op_capital");
  if(product==="recebiveis")steps.push("op_recebiveis");
  const isPJ=["cgi_pj","cgv_pj","capital_giro","recebiveis","fin_imovel"].includes(product);
  if(isPJ){steps.push("dados_empresa");steps.push("atividade_faturamento");steps.push("dados_socios");}
  else steps.push("dados_pessoais");
  if(["cgi_pf","cgi_pj","fin_imovel"].includes(product)){steps.push("endereco_garantia");steps.push("endereco_residencial");}
  if(!isPJ&&!["fin_imovel","fin_veiculo"].includes(product))steps.push("renda");
  steps.push("retorno");steps.push("dados_bancarios");steps.push("docs_pessoais");
  if(["cgi_pf","cgi_pj","fin_imovel"].includes(product))steps.push("docs_imovel");
  if(["cgv_pf","cgv_pj","fin_veiculo"].includes(product))steps.push("docs_veiculo");
  steps.push("confirmacao");
  return steps;
}

function calcResult(product,data){
  const r=RATES[product]||2.0;const pv=parseMoney(data.credito);
  if(["cgi_pf","cgi_pj"].includes(product)){const n=240;const price=pmtPrice(pv,r,n);const sacA=pv/n;return{type:"cgi",pv,n,rate:r,price,sacPri:sacA+pv*(r/100),sacUlt:sacA*(1+r/100)};}
  if(["cgv_pf","cgv_pj"].includes(product)){const n=parseInt(data.parcelas)||60;return{type:"cgv",pv,n,rate:r,price:pmtPrice(pv,r,n)};}
  if(product==="fgts")return{type:"fgts",pv,rate:r};
  if(product==="conta_luz"){const n=parseInt(data.parcelas)||18;return{type:"simples",pv,n,rate:r,price:pmtPrice(pv,r,n)};}
  if(product==="pessoal"){const n=parseInt(data.parcelas)||12;return{type:"simples",pv,n,rate:r,price:pmtPrice(pv,r,n)};}
  if(["recebiveis","capital_giro"].includes(product))return{type:"simples",pv,n:12,rate:r,price:pmtPrice(pv,r,12)};
  if(["fin_imovel","fin_veiculo"].includes(product)){const n=parseInt(data.parcelas)||240;return{type:"fin",pv,n,rate:r,price:pmtPrice(pv,r,n),entrada:parseMoney(data.entrada||"0")};}
  return{type:"simples",pv,n:12,rate:r,price:pmtPrice(pv,r,12)};
}

const S={
  inp:{background:G.inp,border:`1px solid ${G.inpBdr}`,borderRadius:8,padding:"10px 14px",color:G.text,fontSize:15,width:"100%",boxSizing:"border-box",outline:"none"},
  sel:{background:G.inp,border:`1px solid ${G.inpBdr}`,borderRadius:8,padding:"10px 14px",color:G.text,fontSize:15,width:"100%",boxSizing:"border-box",outline:"none",appearance:"none",cursor:"pointer"},
  btn:{background:G.gold,border:"none",borderRadius:8,padding:"13px 28px",color:"#1a0800",fontWeight:700,fontSize:15,cursor:"pointer",width:"100%"},
  ghost:{background:"transparent",border:`1px solid ${G.bdr}`,borderRadius:8,padding:"13px 28px",color:G.sub,fontWeight:500,fontSize:15,cursor:"pointer",width:"100%"},
};

function Fld({label,error,children}){return <div style={{marginBottom:16}}><label style={{color:G.sub,fontSize:13,marginBottom:4,display:"block"}}>{label}</label>{children}{error&&<div style={{color:G.err,fontSize:12,marginTop:4}}>{error}</div>}</div>;}
function InfoRow({label,value,highlight}){return <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${G.bdr}`}}><span style={{color:G.sub,fontSize:13}}>{label}</span><span style={{color:highlight?G.goldL:G.text,fontWeight:highlight?700:400,fontSize:highlight?16:14}}>{value}</span></div>;}

function NavBar({onSimulate}){
  return(
    <nav style={{position:"sticky",top:0,zIndex:100,background:`${G.bg}ee`,backdropFilter:"blur(12px)",borderBottom:`1px solid ${G.bdr}`,padding:"0 24px"}}>
      <div style={{maxWidth:1100,margin:"0 auto",display:"flex",alignItems:"center",height:60,gap:32}}>
        <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
          <div style={{width:36,height:36,background:G.gold,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:15,color:"#1a0800"}}>ZP</div>
          <span style={{color:G.goldL,fontWeight:700,fontSize:16}}>ZP Pay</span>
        </div>
        <div style={{flex:1,display:"flex",gap:28,justifyContent:"center"}}>
          {["Início","Benefícios","Perguntas frequentes"].map(l=>(
            <a key={l} href="#" onClick={e=>{e.preventDefault();document.getElementById(l==="Benefícios"?"beneficios":l==="Perguntas frequentes"?"faq":"hero")?.scrollIntoView({behavior:"smooth"});}} style={{color:G.sub,fontSize:13,textDecoration:"none"}}>{l}</a>
          ))}
        </div>
        <button onClick={onSimulate} style={{background:G.goldD,border:"none",borderRadius:8,padding:"8px 18px",color:G.goldL,fontSize:13,fontWeight:600,cursor:"pointer",flexShrink:0}}>Consultor ZP Pay</button>
      </div>
    </nav>
  );
}

function LandingNavBar({onSimulate}){
  return(
    <nav style={{position:"sticky",top:0,zIndex:100,background:L.card,borderBottom:`1px solid ${L.bdr}`,padding:"0 24px"}}>
      <div style={{maxWidth:1140,margin:"0 auto",display:"flex",alignItems:"center",height:66,gap:32}}>
        <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
          <div style={{width:36,height:36,background:L.bgDark,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:15,color:L.gold}}>ZP</div>
          <span style={{color:L.text,fontWeight:800,fontSize:16}}>ZP Pay</span>
        </div>
        <div style={{flex:1,display:"flex",gap:28,justifyContent:"center"}}>
          {[["hero","Início"],["como-funciona","Como Funciona"],["diferenciais","Diferenciais"],["faq","FAQ"]].map(([id,label])=>(
            <a key={id} href="#" onClick={e=>{e.preventDefault();document.getElementById(id)?.scrollIntoView({behavior:"smooth"});}} style={{color:L.subWarm,fontSize:13,textDecoration:"none",fontWeight:500}}>{label}</a>
          ))}
        </div>
        <button onClick={onSimulate} style={{background:L.bgDark,border:"none",borderRadius:8,padding:"9px 20px",color:L.gold,fontSize:13,fontWeight:600,cursor:"pointer",flexShrink:0}}>Consultor ZP Pay</button>
      </div>
    </nav>
  );
}

function StepsBar({steps,current}){
  return(
    <div style={{display:"flex",alignItems:"center",gap:3,marginBottom:20,flexWrap:"wrap",rowGap:6}}>
      {steps.map((s,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",gap:3}}>
          <div style={{width:22,height:22,borderRadius:"50%",background:i<current?G.ok:i===current?G.gold:G.bdr,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:i<=current?"#1a0800":G.sub,flexShrink:0}}>
            {i<current?<Ico n="check" s={12} c="#1a0800" sw={3}/>:i+1}
          </div>
          {i<steps.length-1&&<div style={{width:14,height:2,background:i<current?G.ok:G.bdr,flexShrink:0}}/>}
        </div>
      ))}
      <span style={{color:G.sub,fontSize:12,marginLeft:6}}>{STEP_LABELS[steps[current]]||steps[current]}</span>
    </div>
  );
}

function DocUploadStep({title,docs}){
  const[uploaded,setUploaded]=useState({});
  const toggle=k=>setUploaded(p=>({...p,[k]:!p[k]}));
  const count=Object.values(uploaded).filter(Boolean).length;
  return(
    <div>
      <h3 style={{color:G.text,fontSize:15,fontWeight:600,marginBottom:4}}>{title}</h3>
      <p style={{color:G.sub,fontSize:12,marginBottom:14}}>Formatos aceitos: PDF e JPEG. Todos os itens são obrigatórios.</p>
      {docs.map((doc,i)=>(
        <div key={i} style={{background:uploaded[i]?`${G.ok}18`:G.cardHov,border:`1px solid ${uploaded[i]?G.ok:G.bdr}`,borderRadius:8,padding:"10px 14px",marginBottom:8,display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:22,height:22,borderRadius:"50%",background:uploaded[i]?G.ok:G.bdr,display:"flex",alignItems:"center",justifyContent:"center",color:uploaded[i]?"#1a0800":G.sub,flexShrink:0,fontSize:10,fontWeight:700}}>{uploaded[i]?<Ico n="check" s={12} c="#1a0800" sw={3}/>:i+1}</div>
          <div style={{flex:1,color:uploaded[i]?G.ok:G.text,fontSize:13,fontWeight:uploaded[i]?600:400}}>{doc}{uploaded[i]&&<span style={{color:G.ok,fontSize:11,display:"block"}}>Enviado</span>}</div>
          <button onClick={()=>toggle(i)} style={{background:uploaded[i]?G.ok:G.gold,border:"none",borderRadius:6,padding:"6px 12px",fontSize:12,color:"#1a0800",cursor:"pointer",fontWeight:600,flexShrink:0}}>{uploaded[i]?"OK":"Enviar"}</button>
        </div>
      ))}
      <div style={{background:`${G.gold}18`,borderRadius:8,padding:10,marginTop:8}}>
        <div style={{color:G.goldL,fontSize:12}}>{count}/{docs.length} documentos{count===docs.length?" — tudo pronto":""}</div>
      </div>
    </div>
  );
}

function ContractStep({stepId,cData,cd,errors,clrErr,result}){
  const warnBox=msg=><div style={{background:`${G.err}22`,border:`1px solid ${G.err}`,borderRadius:8,padding:12,display:"flex",gap:10,alignItems:"flex-start",marginBottom:12}}><span style={{color:G.err,marginTop:1,flexShrink:0}}><Ico n="warn" s={16} c={G.err}/></span><p style={{color:G.err,fontSize:13,margin:0}}>{msg}</p></div>;

  const addr=(prefix,title)=>(
    <div>
      <h3 style={{color:G.text,fontSize:15,fontWeight:600,marginBottom:16}}>{title}</h3>
      <Fld label="CEP" error={errors[`${prefix}_cep`]}>
        <input style={{...S.inp,borderColor:errors[`${prefix}_cep`]?G.err:G.inpBdr}} placeholder="00000-000" value={cData[`${prefix}_cep`]||""} onChange={e=>{cd(`${prefix}_cep`,maskCEP(e.target.value));clrErr(`${prefix}_cep`);}}/>
      </Fld>
      <div style={{display:"grid",gridTemplateColumns:"3fr 1fr",gap:8}}>
        <Fld label="Rua"><input style={S.inp} value={cData[`${prefix}_rua`]||""} onChange={e=>cd(`${prefix}_rua`,e.target.value)}/></Fld>
        <Fld label="Número" error={errors[`${prefix}_numero`]}>
          <input style={{...S.inp,borderColor:errors[`${prefix}_numero`]?G.err:G.inpBdr}} placeholder="Nº" value={cData[`${prefix}_numero`]||""} onChange={e=>{cd(`${prefix}_numero`,e.target.value);clrErr(`${prefix}_numero`);}}/>
        </Fld>
      </div>
      <Fld label="Complemento (opcional)">
        <input style={S.inp} placeholder="Apto, Bloco..." value={cData[`${prefix}_compl`]||""} onChange={e=>cd(`${prefix}_compl`,e.target.value)}/>
      </Fld>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 80px",gap:8}}>
        <Fld label="Bairro"><input style={S.inp} value={cData[`${prefix}_bairro`]||""} onChange={e=>cd(`${prefix}_bairro`,e.target.value)}/></Fld>
        <Fld label="Cidade"><input style={S.inp} value={cData[`${prefix}_cidade`]||""} onChange={e=>cd(`${prefix}_cidade`,e.target.value)}/></Fld>
        <Fld label="UF">
          <select style={S.sel} value={cData[`${prefix}_uf`]||""} onChange={e=>cd(`${prefix}_uf`,e.target.value)}>
            <option value=""></option>
            {UFS.map(uf=><option key={uf}>{uf}</option>)}
          </select>
        </Fld>
      </div>
    </div>
  );

  if(stepId==="operacao") return(
    <div>
      <h3 style={{color:G.text,fontSize:15,fontWeight:600,marginBottom:16}}>Dados da Operação</h3>
      <Fld label="Tipo de imóvel" error={errors.tipoImovel}>
        <select style={{...S.sel,borderColor:errors.tipoImovel?G.err:G.inpBdr}} value={cData.tipoImovel||""} onChange={e=>{cd("tipoImovel",e.target.value);clrErr("tipoImovel");}}>
          <option value="">Selecione...</option>
          {["Residencial","Comercial","Terreno","Rural"].map(t=><option key={t}>{t}</option>)}
        </select>
      </Fld>
      <Fld label="Finalidade do crédito" error={errors.motivo}>
        <select style={{...S.sel,borderColor:errors.motivo?G.err:G.inpBdr}} value={cData.motivo||""} onChange={e=>{cd("motivo",e.target.value);clrErr("motivo");}}>
          <option value="">Selecione...</option>
          {["Quitar dívidas","Reformar o imóvel","Capital de giro","Investimento","Outros"].map(m=><option key={m}>{m}</option>)}
        </select>
      </Fld>
      <Fld label="Número de matrícula do imóvel" error={errors.matricula}>
        <input style={{...S.inp,borderColor:errors.matricula?G.err:G.inpBdr}} placeholder="Ex: 12345" value={cData.matricula||""} onChange={e=>{cd("matricula",e.target.value);clrErr("matricula");}}/>
      </Fld>
      <Fld label="Imóvel possui dívida ativa / hipoteca?">
        <select style={S.sel} value={cData.divida||""} onChange={e=>cd("divida",e.target.value)}>
          <option value="">Selecione...</option>
          <option value="nao">Não</option>
          <option value="sim">Sim</option>
        </select>
      </Fld>
      {result&&<div style={{background:`${G.goldD}22`,border:`1px solid ${G.goldD}`,borderRadius:8,padding:12,marginTop:4}}><div style={{color:G.goldL,fontSize:13,fontWeight:600}}>Valor do crédito: {brl(result.pv)}</div></div>}
    </div>
  );

  if(stepId==="op_veiculo") return(
    <div>
      <h3 style={{color:G.text,fontSize:15,fontWeight:600,marginBottom:16}}>Dados do Veículo</h3>
      <Fld label="Tipo de veículo">
        <select style={S.sel} value={cData.tipoVeiculo||""} onChange={e=>cd("tipoVeiculo",e.target.value)}>
          <option value="">Selecione...</option>
          {["Carro","Moto","Caminhão","Van / Utilitário"].map(t=><option key={t}>{t}</option>)}
        </select>
      </Fld>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:8}}>
        <Fld label="Marca / Modelo"><input style={S.inp} placeholder="Ex: Honda Civic" value={cData.modeloVeiculo||""} onChange={e=>cd("modeloVeiculo",e.target.value)}/></Fld>
        <Fld label="Ano"><input style={S.inp} placeholder="2020" maxLength={4} value={cData.anoVeiculo||""} onChange={e=>cd("anoVeiculo",e.target.value.replace(/\D/g,"").slice(0,4))}/></Fld>
      </div>
      <Fld label="Placa">
        <input style={S.inp} placeholder="ABC-1234" value={cData.placaVeiculo||""} onChange={e=>cd("placaVeiculo",e.target.value.toUpperCase().slice(0,8))}/>
      </Fld>
      <Fld label="Veículo possui financiamento ativo?">
        <select style={S.sel} value={cData.finAtivo||""} onChange={e=>cd("finAtivo",e.target.value)}>
          <option value="">Selecione...</option>
          <option value="nao">Não</option>
          <option value="sim">Sim</option>
        </select>
      </Fld>
    </div>
  );

  if(stepId==="fgts_check") return(
    <div>
      <h3 style={{color:G.text,fontSize:15,fontWeight:600,marginBottom:12}}>Verificação FGTS</h3>
      <p style={{color:G.sub,fontSize:13,lineHeight:1.7,marginBottom:16}}>Para antecipar o Saque Aniversário FGTS, você precisa ter aderido a essa modalidade no app do FGTS ou agência da Caixa.</p>
      <Fld label="Você já habilitou o Saque Aniversário?">
        <select style={S.sel} value={cData.fgtsHabilitado||""} onChange={e=>cd("fgtsHabilitado",e.target.value)}>
          <option value="">Selecione...</option>
          <option value="sim">Sim, já habilitei</option>
          <option value="nao">Ainda não</option>
          <option value="naosabe">Não sei</option>
        </select>
      </Fld>
      {cData.fgtsHabilitado==="nao"&&warnBox("Você precisará habilitar o Saque Aniversário no app Caixa Tem ou agência antes de prosseguir.")}
      <Fld label="Banco onde está o FGTS">
        <select style={S.sel} value={cData.bancoFgts||""} onChange={e=>cd("bancoFgts",e.target.value)}>
          <option value="">Selecione...</option>
          {BANCOS.map(b=><option key={b}>{b}</option>)}
        </select>
      </Fld>
    </div>
  );

  if(stepId==="op_capital") return(
    <div>
      <h3 style={{color:G.text,fontSize:15,fontWeight:600,marginBottom:16}}>Operação — Capital de Giro</h3>
      <Fld label="Finalidade do capital">
        <select style={S.sel} value={cData.finalidadeCapital||""} onChange={e=>cd("finalidadeCapital",e.target.value)}>
          <option value="">Selecione...</option>
          {["Compra de estoque","Pagamento de fornecedores","Folha de pagamento","Expansão","Outros"].map(f=><option key={f}>{f}</option>)}
        </select>
      </Fld>
      <Fld label="Prazo desejado">
        <select style={S.sel} value={cData.prazoCapital||""} onChange={e=>cd("prazoCapital",e.target.value)}>
          <option value="">Selecione...</option>
          {["6","12","18","24","36"].map(p=><option key={p} value={p}>{p} meses</option>)}
        </select>
      </Fld>
    </div>
  );

  if(stepId==="op_recebiveis") return(
    <div>
      <h3 style={{color:G.text,fontSize:15,fontWeight:600,marginBottom:16}}>Antecipação de Recebíveis</h3>
      <Fld label="Tipo de recebível">
        <select style={S.sel} value={cData.tipoRecContrato||""} onChange={e=>cd("tipoRecContrato",e.target.value)}>
          <option value="">Selecione...</option>
          {["Maquininha (cartão)","Boleto bancário","Nota Fiscal (NFe)","Contrato a receber","Duplicata"].map(t=><option key={t}>{t}</option>)}
        </select>
      </Fld>
      <Fld label="Bandeira / Adquirente (se cartão)">
        <input style={S.inp} placeholder="Ex: Stone, Cielo, PagSeguro..." value={cData.adquirente||""} onChange={e=>cd("adquirente",e.target.value)}/>
      </Fld>
      <Fld label="Prazo médio dos recebíveis">
        <select style={S.sel} value={cData.prazoRec||""} onChange={e=>cd("prazoRec",e.target.value)}>
          <option value="">Selecione...</option>
          {["Até 30 dias","31 a 60 dias","61 a 90 dias","Acima de 90 dias"].map(p=><option key={p}>{p}</option>)}
        </select>
      </Fld>
    </div>
  );

  if(stepId==="dados_empresa") return(
    <div>
      <h3 style={{color:G.text,fontSize:15,fontWeight:600,marginBottom:16}}>Dados da Empresa</h3>
      <Fld label="Razão Social" error={errors.razaoSocial}>
        <input style={{...S.inp,borderColor:errors.razaoSocial?G.err:G.inpBdr}} value={cData.razaoSocial||""} onChange={e=>{cd("razaoSocial",e.target.value);clrErr("razaoSocial");}}/>
      </Fld>
      <Fld label="CNPJ" error={errors.cnpj}>
        <input style={{...S.inp,borderColor:errors.cnpj?G.err:G.inpBdr}} placeholder="00.000.000/0000-00" value={cData.cnpj||""} onChange={e=>{cd("cnpj",maskCNPJ(e.target.value));clrErr("cnpj");}}/>
      </Fld>
      <Fld label="Tempo de empresa" error={errors.tempoEmpresa}>
        <select style={{...S.sel,borderColor:errors.tempoEmpresa?G.err:G.inpBdr}} value={cData.tempoEmpresa||""} onChange={e=>{cd("tempoEmpresa",e.target.value);clrErr("tempoEmpresa");}}>
          <option value="">Selecione...</option>
          <option value="menos3">Menos de 3 anos</option>
          <option value="3a5">3 a 5 anos</option>
          <option value="5a10">5 a 10 anos</option>
          <option value="mais10">Mais de 10 anos</option>
        </select>
      </Fld>
      {cData.tempoEmpresa==="menos3"&&warnBox("Empresa precisa ter pelo menos 3 anos de atividade para esta operação.")}
      <Fld label="Telefone comercial">
        <input style={S.inp} placeholder="(11) 99999-9999" value={cData.telEmpresa||""} onChange={e=>cd("telEmpresa",maskTel(e.target.value))}/>
      </Fld>
    </div>
  );

  if(stepId==="atividade_faturamento") return(
    <div>
      <h3 style={{color:G.text,fontSize:15,fontWeight:600,marginBottom:16}}>Atividade e Faturamento</h3>
      <Fld label="Atividade principal (CNAE)">
        <input style={S.inp} placeholder="Ex: Comércio varejista, Serviços..." value={cData.atividade||""} onChange={e=>cd("atividade",e.target.value)}/>
      </Fld>
      <Fld label="Faturamento mensal médio">
        <input style={S.inp} placeholder="R$ 0,00" value={cData.faturamento||""} onChange={e=>cd("faturamento",maskMoney(e.target.value))}/>
      </Fld>
      <Fld label="Possui dívidas ativas (protesto / PGFN)?">
        <select style={S.sel} value={cData.dividaAtiva||""} onChange={e=>cd("dividaAtiva",e.target.value)}>
          <option value="">Selecione...</option>
          <option value="nao">Não</option>
          <option value="sim">Sim</option>
        </select>
      </Fld>
    </div>
  );

  if(stepId==="dados_socios") return(
    <div>
      <h3 style={{color:G.text,fontSize:15,fontWeight:600,marginBottom:16}}>Dados do Sócio Principal</h3>
      <Fld label="Nome completo">
        <input style={S.inp} placeholder="Nome do sócio" value={cData.nomeSocio||""} onChange={e=>cd("nomeSocio",e.target.value)}/>
      </Fld>
      <Fld label="CPF do sócio">
        <input style={S.inp} placeholder="000.000.000-00" value={cData.cpfSocio||""} onChange={e=>cd("cpfSocio",maskCPF(e.target.value))}/>
      </Fld>
      <Fld label="Participação (%)">
        <input style={S.inp} placeholder="Ex: 50" value={cData.participacao||""} onChange={e=>cd("participacao",e.target.value.replace(/\D/g,""))}/>
      </Fld>
      <Fld label="E-mail do sócio">
        <input style={S.inp} placeholder="email@empresa.com" value={cData.emailSocio||""} onChange={e=>cd("emailSocio",e.target.value)}/>
      </Fld>
    </div>
  );

  if(stepId==="dados_pessoais") return(
    <div>
      <h3 style={{color:G.text,fontSize:15,fontWeight:600,marginBottom:16}}>Dados Pessoais</h3>
      <Fld label="Nome completo" error={errors.nome}>
        <input style={{...S.inp,borderColor:errors.nome?G.err:G.inpBdr}} placeholder="Nome e sobrenome" value={cData.nome||""} onChange={e=>{cd("nome",e.target.value);clrErr("nome");}}/>
      </Fld>
      <Fld label="CPF" error={errors.cpf}>
        <input style={{...S.inp,borderColor:errors.cpf?G.err:G.inpBdr}} placeholder="000.000.000-00" value={cData.cpf||""} onChange={e=>{cd("cpf",maskCPF(e.target.value));clrErr("cpf");}}/>
      </Fld>
      <Fld label="Data de nascimento" error={errors.nascimento}>
        <input type="date" style={{...S.inp,borderColor:errors.nascimento?G.err:G.inpBdr}} value={cData.nascimento||""} onChange={e=>{cd("nascimento",e.target.value);clrErr("nascimento");}}/>
      </Fld>
      <Fld label="E-mail" error={errors.email}>
        <input style={{...S.inp,borderColor:errors.email?G.err:G.inpBdr}} placeholder="email@exemplo.com" value={cData.email||""} onChange={e=>{cd("email",e.target.value);clrErr("email");}}/>
      </Fld>
      <Fld label="WhatsApp" error={errors.whatsapp}>
        <div style={{display:"flex",gap:8}}>
          <div style={{...S.inp,width:80,flexShrink:0,color:G.sub,fontSize:13,textAlign:"center"}}>+55</div>
          <input style={{...S.inp,flex:1,borderColor:errors.whatsapp?G.err:G.inpBdr}} placeholder="(11) 99999-9999" value={cData.whatsapp||""} onChange={e=>{cd("whatsapp",maskTel(e.target.value));clrErr("whatsapp");}}/>
        </div>
      </Fld>
      <Fld label="Estado civil">
        <select style={S.sel} value={cData.estadoCivil||""} onChange={e=>cd("estadoCivil",e.target.value)}>
          <option value="">Selecione...</option>
          {["Solteiro(a)","Casado(a)","Divorciado(a)","Viúvo(a)","União estável"].map(s=><option key={s}>{s}</option>)}
        </select>
      </Fld>
    </div>
  );

  if(stepId==="endereco_garantia")return addr("endereco_garantia","Endereço do Imóvel em Garantia");
  if(stepId==="endereco_residencial")return addr("endereco_residencial","Endereço Residencial");

  if(stepId==="renda") return(
    <div>
      <h3 style={{color:G.text,fontSize:15,fontWeight:600,marginBottom:16}}>Renda e Ocupação</h3>
      <Fld label="Ocupação" error={errors.ocupacao}>
        <select style={{...S.sel,borderColor:errors.ocupacao?G.err:G.inpBdr}} value={cData.ocupacao||""} onChange={e=>{cd("ocupacao",e.target.value);clrErr("ocupacao");}}>
          <option value="">Selecione...</option>
          {["Assalariado CLT","Servidor público","Autônomo / Freelancer","Empresário","Aposentado / Pensionista","Profissional liberal","Outros"].map(o=><option key={o}>{o}</option>)}
        </select>
      </Fld>
      <Fld label="Renda mensal bruta" error={errors.renda}>
        <input style={{...S.inp,borderColor:errors.renda?G.err:G.inpBdr}} placeholder="R$ 0,00" value={cData.renda||""} onChange={e=>{cd("renda",maskMoney(e.target.value));clrErr("renda");}}/>
      </Fld>
      <Fld label="Possui renda complementar?">
        <select style={S.sel} value={cData.rendaCompl||""} onChange={e=>cd("rendaCompl",e.target.value)}>
          <option value="">Selecione...</option>
          <option value="nao">Não</option>
          <option value="sim">Sim</option>
        </select>
      </Fld>
      {cData.rendaCompl==="sim"&&<Fld label="Valor da renda complementar"><input style={S.inp} placeholder="R$ 0,00" value={cData.rendaComplValor||""} onChange={e=>cd("rendaComplValor",maskMoney(e.target.value))}/></Fld>}
    </div>
  );

  if(stepId==="retorno") return(
    <div>
      <h3 style={{color:G.text,fontSize:15,fontWeight:600,marginBottom:12}}>Preferência de Retorno</h3>
      <p style={{color:G.sub,fontSize:13,lineHeight:1.7,marginBottom:16}}>Nossa equipe entrará em contato para dar continuidade à proposta. Como prefere ser contatado?</p>
      <Fld label="Melhor canal">
        <select style={S.sel} value={cData.canalRetorno||""} onChange={e=>cd("canalRetorno",e.target.value)}>
          <option value="">Selecione...</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="email">E-mail</option>
          <option value="ligacao">Ligação telefônica</option>
        </select>
      </Fld>
      <Fld label="Melhor período">
        <select style={S.sel} value={cData.periodoRetorno||""} onChange={e=>cd("periodoRetorno",e.target.value)}>
          <option value="">Selecione...</option>
          <option value="manha">Manhã (8h–12h)</option>
          <option value="tarde">Tarde (12h–18h)</option>
          <option value="noite">Noite (18h–20h)</option>
          <option value="qualquer">Qualquer horário</option>
        </select>
      </Fld>
      <div style={{background:`${G.goldD}22`,border:`1px solid ${G.goldD}`,borderRadius:8,padding:12,marginTop:4}}>
        <div style={{color:G.goldL,fontSize:12,fontWeight:600}}>Você receberá um link via WhatsApp para retomar a proposta caso precise pausar o processo.</div>
      </div>
    </div>
  );

  if(stepId==="dados_bancarios") return(
    <div>
      <h3 style={{color:G.text,fontSize:15,fontWeight:600,marginBottom:16}}>Dados Bancários</h3>
      <Fld label="Banco" error={errors.banco}>
        <select style={{...S.sel,borderColor:errors.banco?G.err:G.inpBdr}} value={cData.banco||""} onChange={e=>{cd("banco",e.target.value);clrErr("banco");}}>
          <option value="">Selecione...</option>
          {BANCOS.map(b=><option key={b}>{b}</option>)}
        </select>
      </Fld>
      <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:8}}>
        <Fld label="Agência" error={errors.agencia}>
          <input style={{...S.inp,borderColor:errors.agencia?G.err:G.inpBdr}} placeholder="0000" value={cData.agencia||""} onChange={e=>{cd("agencia",e.target.value.replace(/\D/g,""));clrErr("agencia");}}/>
        </Fld>
        <Fld label="Conta (com dígito)" error={errors.conta}>
          <input style={{...S.inp,borderColor:errors.conta?G.err:G.inpBdr}} placeholder="00000-0" value={cData.conta||""} onChange={e=>{cd("conta",e.target.value);clrErr("conta");}}/>
        </Fld>
      </div>
      <Fld label="Tipo de conta">
        <select style={S.sel} value={cData.tipoConta||""} onChange={e=>cd("tipoConta",e.target.value)}>
          <option value="">Selecione...</option>
          <option value="corrente">Corrente</option>
          <option value="poupanca">Poupança</option>
          <option value="pagamento">Conta de pagamento</option>
        </select>
      </Fld>
      <Fld label="Conta em seu nome?" error={errors.confirmaContaTitular}>
        <div style={{display:"flex",gap:12,marginTop:4}}>
          {["Sim, é minha conta","Não"].map(opt=>(
            <button key={opt} onClick={()=>{cd("confirmaContaTitular",opt);clrErr("confirmaContaTitular");}} style={{flex:1,background:cData.confirmaContaTitular===opt?`${G.goldD}44`:G.card,border:`1px solid ${cData.confirmaContaTitular===opt?G.gold:G.bdr}`,borderRadius:8,padding:"10px",color:cData.confirmaContaTitular===opt?G.goldL:G.text,fontSize:13,cursor:"pointer",fontWeight:cData.confirmaContaTitular===opt?600:400}}>{opt}</button>
          ))}
        </div>
        {errors.confirmaContaTitular&&<div style={{color:G.err,fontSize:12,marginTop:4}}>{errors.confirmaContaTitular}</div>}
      </Fld>
    </div>
  );

  if(stepId==="docs_pessoais") return(
    <DocUploadStep title="Documentos Pessoais" docs={["RG ou CNH (frente)","RG ou CNH (verso)","CPF","Comprovante de endereço (últimos 90 dias)","Comprovante de renda"]}/>
  );

  if(stepId==="docs_imovel") return(
    <DocUploadStep title="Documentos do Imóvel" docs={["Matrícula atualizada do imóvel (máx. 30 dias)","IPTU (último exercício)","Certidão de ônus reais","Foto fachada do imóvel"]}/>
  );

  if(stepId==="docs_veiculo") return(
    <DocUploadStep title="Documentos do Veículo" docs={["CRLV (documento do veículo)","CNH do proprietário","Foto frente do veículo","Foto traseira do veículo","Foto do painel (hodômetro)"]}/>
  );

  if(stepId==="confirmacao") return(
    <div>
      <h3 style={{color:G.text,fontSize:15,fontWeight:600,marginBottom:16}}>Revisão e Confirmação</h3>
      <p style={{color:G.sub,fontSize:13,lineHeight:1.7,marginBottom:16}}>Revise as informações antes de enviar. Ao clicar em "Finalizar e Enviar", sua proposta será encaminhada para análise.</p>
      {result&&<div style={{background:G.card,border:`1px solid ${G.bdr}`,borderRadius:10,padding:16,marginBottom:16}}>
        <div style={{color:G.sub,fontSize:12,marginBottom:10,fontWeight:600}}>Resumo da operação</div>
        <InfoRow label="Crédito solicitado" value={brl(result.pv||0)}/>
        {result.price&&<InfoRow label="Parcela estimada" value={brl(result.price)} highlight/>}
        {result.n&&<InfoRow label="Prazo" value={`${result.n} meses`}/>}
        <InfoRow label="Taxa indicativa" value={`${result.rate}% a.m.`}/>
      </div>}
      <div style={{background:`${G.ok}11`,border:`1px solid ${G.ok}`,borderRadius:10,padding:16}}>
        <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
          <span style={{color:G.ok,flexShrink:0,marginTop:1}}><Ico n="check" s={16} c={G.ok} sw={2.5}/></span>
          <div>
            <div style={{color:G.ok,fontWeight:600,fontSize:13,marginBottom:4}}>Tudo pronto para envio</div>
            <div style={{color:G.sub,fontSize:12,lineHeight:1.6}}>Ao confirmar, você autoriza a ZP Pay a realizar análise de crédito e entrar em contato para dar continuidade à proposta.</div>
          </div>
        </div>
      </div>
    </div>
  );

  return <div style={{color:G.sub,fontSize:13}}>Carregando etapa...</div>;
}

export default function App(){
  const[view,setView]=useState("landing");
  const[cat,setCat]=useState("pf");
  const[product,setProduct]=useState("");
  const[simCat,setSimCat]=useState("");
  const[simProd,setSimProd]=useState("");
  const[simData,setSimData]=useState({});
  const[result,setResult]=useState(null);
  const[step,setStep]=useState(0);
  const[cData,setCData]=useState({});
  const[errors,setErrors]=useState({});
  const[modal,setModal]=useState("price");
  const[openFaq,setOpenFaq]=useState(null);

  const sd=(k,v)=>setSimData(p=>({...p,[k]:v}));
  const cd=(k,v)=>setCData(p=>({...p,[k]:v}));
  const clrErr=k=>setErrors(p=>{const n={...p};delete n[k];return n;});

  const goHome=()=>{setView("landing");setCat("pf");setProduct("");setSimCat("");setSimProd("");setSimData({});setResult(null);setStep(0);setCData({});setErrors({});setModal("price");};
  const goProduct=(c)=>{setCat(c);setView("product");};

  const innerWrap=(children,maxW=520)=>(
    <div style={{background:G.bg,minHeight:"100vh",padding:"0 0 60px"}}>
      <div style={{maxWidth:maxW,margin:"0 auto",padding:"24px 16px"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
          <button onClick={goHome} style={{background:"none",border:"none",color:G.sub,cursor:"pointer",fontSize:13,padding:0}}>← Início</button>
          <span style={{color:G.bdr}}>|</span>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:28,height:28,background:G.gold,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:12,color:"#1a0800"}}>ZP</div>
            <span style={{color:G.goldL,fontWeight:700,fontSize:14}}>ZP Pay</span>
          </div>
        </div>
        {children}
      </div>
    </div>
  );

  // ── LANDING ────────────────────────────────────────────────────────────────
  if(view==="landing") return(
    <div style={{background:L.bg,minHeight:"100vh",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",color:L.text}}>
      <LandingNavBar onSimulate={()=>goProduct("sim")}/>

      {/* ── ANNOUNCEMENT BAR ── */}
      <div style={{background:L.bgDark,padding:"11px 0"}}>
        <div style={{maxWidth:1140,margin:"0 auto",display:"flex",justifyContent:"center",alignItems:"center",gap:0,padding:"0 24px",overflow:"hidden"}}>
          {["Simulação 100% gratuita","Sem compromisso","Processo totalmente digital","Atendimento especializado"].map((t,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:20}}>
              {i>0&&<span style={{color:L.goldD,margin:"0 20px",fontSize:6}}>●</span>}
              <span style={{color:L.gold,fontSize:12,fontWeight:500,whiteSpace:"nowrap"}}>{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── HERO ── */}
      <section id="hero" style={{padding:"96px 24px 80px",textAlign:"center",position:"relative",overflow:"hidden",background:L.bg}}>
        <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at 50% -10%,${L.gold}18 0%,transparent 60%)`}}/>
        <div style={{position:"relative",maxWidth:680,margin:"0 auto"}}>
          <div style={{display:"inline-flex",alignItems:"center",background:L.badge,border:`1px solid ${L.bdr}`,borderRadius:20,padding:"5px 16px",marginBottom:28}}>
            <span style={{color:L.badgeText,fontSize:11,fontWeight:700,letterSpacing:1.5}}>SOLUÇÕES DE CRÉDITO</span>
          </div>
          <h1 style={{color:L.text,fontSize:54,fontWeight:900,lineHeight:1.08,margin:"0 0 20px",letterSpacing:-1.5}}>
            Crédito inteligente<br/>para realizar{" "}
            <span style={{color:L.gold}}>seus planos</span>
          </h1>
          <p style={{color:L.sub,fontSize:16,lineHeight:1.75,margin:"0 auto 40px",maxWidth:500}}>
            Transforme seu imóvel, veículo ou FGTS em crédito com as melhores taxas do mercado. 100% digital, sem sair de casa, resposta em até 48h.
          </p>
          <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",marginBottom:44}}>
            <button onClick={()=>goProduct("pf")} style={{background:L.btn,border:"none",borderRadius:10,padding:"15px 32px",color:"#ffffff",fontSize:15,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:8,boxShadow:"0 4px 20px #1a080033"}}>
              Iniciar simulação gratuita <Ico n="arrow" s={16} c="#ffffff"/>
            </button>
            <button onClick={()=>goProduct("pj")} style={{background:"transparent",border:`1.5px solid ${L.bdr}`,borderRadius:10,padding:"15px 24px",color:L.subWarm,fontSize:14,fontWeight:500,cursor:"pointer"}}>
              Sou empresa
            </button>
          </div>
          <div style={{display:"flex",justifyContent:"center",gap:24,flexWrap:"wrap"}}>
            {[[<Ico n="shield" s={13} c={L.gold}/>,"LGPD protegido"],[<Ico n="lock" s={13} c={L.gold}/>,"100% digital"],[<Ico n="zap" s={13} c={L.gold}/>,"Análise em 48h"],[<Ico n="check" s={13} c={L.gold} sw={2.5}/>,"Sem compromisso"]].map(([ico,txt],i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:6}}>
                {ico}<span style={{color:L.sub,fontSize:12}}>{txt}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NÚMEROS ── */}
      <section style={{background:L.bgAlt,borderTop:`1px solid ${L.bdr}`,borderBottom:`1px solid ${L.bdr}`,padding:"28px 24px"}}>
        <div style={{maxWidth:1140,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:0}}>
          {[["1,29%","Taxa a partir de","ao mês"],["240x","Prazos de até","meses"],["48h","Resposta em","úteis"],["100%","Processo","digital"]].map(([n,l,sx],i)=>(
            <div key={i} style={{textAlign:"center",padding:"8px 16px",borderRight:i<3?`1px solid ${L.bdr}`:undefined}}>
              <div style={{color:L.gold,fontWeight:900,fontSize:26,lineHeight:1}}>{n}</div>
              <div style={{color:L.sub,fontSize:12,marginTop:6}}>{l} <span style={{color:L.subWarm,fontWeight:600}}>{sx}</span></div>
            </div>
          ))}
        </div>
      </section>

      {/* ── COMO FUNCIONA ── */}
      <section id="como-funciona" style={{padding:"88px 24px",background:L.bg}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:56}}>
            <div style={{display:"inline-flex",background:L.badge,border:`1px solid ${L.bdr}`,borderRadius:20,padding:"5px 16px",marginBottom:20}}>
              <span style={{color:L.badgeText,fontSize:11,fontWeight:700,letterSpacing:1.5}}>COMO FUNCIONA</span>
            </div>
            <h2 style={{color:L.text,fontSize:40,fontWeight:900,margin:0,letterSpacing:-.5}}>Simples, rápido e transparente</h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:72,alignItems:"center"}}>
            {/* Photo */}
            <div style={{position:"relative"}}>
              <div style={{borderRadius:22,overflow:"hidden",backgroundImage:"url(/img/celular.jpg)",backgroundSize:"cover",backgroundPosition:"center top",backgroundColor:L.bgAlt,aspectRatio:"4/5",maxHeight:540}}/>
              <div style={{position:"absolute",bottom:24,left:"50%",transform:"translateX(-50%)",background:L.bgDark,borderRadius:16,padding:"14px 28px",textAlign:"center",minWidth:190,boxShadow:"0 12px 40px #00000033"}}>
                <div style={{color:"#ffffff",fontWeight:900,fontSize:28,lineHeight:1}}>100%</div>
                <div style={{color:L.gold,fontSize:12,marginTop:4,fontWeight:500}}>Digital & Seguro</div>
              </div>
            </div>
            {/* Steps */}
            <div>
              {[["Simule em minutos","Veja suas possibilidades de crédito imediatamente, sem compromisso e sem custo."],["Escolha o melhor caminho","Você decide se quer avançar. Sem pressão, no seu tempo."],["Cuidamos de tudo por você","Sua solicitação é estruturada e encaminhada para as instituições mais compatíveis com seu perfil."],["Receba o retorno e contrate","Acompanhe o processo e finalize a contratação de forma 100% digital."]].map(([t,d],i)=>(
                <div key={i} style={{display:"flex",gap:20,marginBottom:28,alignItems:"flex-start"}}>
                  <div style={{width:40,height:40,borderRadius:"50%",background:L.gold,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontWeight:900,fontSize:16,color:"#ffffff",boxShadow:`0 4px 16px ${L.gold}55`}}>
                    {i+1}
                  </div>
                  <div>
                    <div style={{color:L.text,fontWeight:700,fontSize:15,marginBottom:5}}>{t}</div>
                    <div style={{color:L.sub,fontSize:13,lineHeight:1.65}}>{d}</div>
                  </div>
                </div>
              ))}
              <button onClick={()=>goProduct("pf")} style={{background:L.btn,border:"none",borderRadius:10,padding:"14px 28px",color:"#ffffff",fontWeight:700,fontSize:14,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:8,marginTop:8,boxShadow:"0 4px 20px #1a080022"}}>
                Iniciar simulação gratuita <Ico n="arrow" s={15} c="#ffffff"/>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER 2 ── */}
      <div style={{background:L.bgDark,padding:"11px 0"}}>
        <div style={{maxWidth:1140,margin:"0 auto",display:"flex",justifyContent:"center",alignItems:"center",padding:"0 24px",gap:0}}>
          {["Simulação 100% gratuita","Sem compromisso","Processo totalmente digital","Atendimento especializado"].map((t,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center"}}>
              {i>0&&<span style={{color:L.goldD,margin:"0 20px",fontSize:6}}>●</span>}
              <span style={{color:L.gold,fontSize:12,fontWeight:500,whiteSpace:"nowrap"}}>{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── DIFERENCIAIS ── */}
      <section id="diferenciais" style={{padding:"88px 24px",background:L.bg}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:56}}>
            <div style={{display:"inline-flex",background:L.badge,border:`1px solid ${L.bdr}`,borderRadius:20,padding:"5px 16px",marginBottom:20}}>
              <span style={{color:L.badgeText,fontSize:11,fontWeight:700,letterSpacing:1.5}}>DIFERENCIAIS</span>
            </div>
            <h2 style={{color:L.text,fontSize:40,fontWeight:900,margin:"0 0 12px",letterSpacing:-.5}}>Por que escolher a ZP Pay?</h2>
            <p style={{color:L.sub,fontSize:14,maxWidth:460,margin:"0 auto",lineHeight:1.7}}>
              Conectamos você às melhores soluções de crédito com{" "}
              <span style={{color:L.gold,fontWeight:600}}>agilidade, transparência e cuidado</span>.
            </p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:64,alignItems:"center"}}>
            {/* Feature cards */}
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              {[["zap","Análise ágil e eficiente","Resposta rápida com suporte de especialistas dedicados ao seu perfil. Sem enrolação."],["check","As melhores condições do mercado","Parceiros financeiros cuidadosamente selecionados para oferecer as taxas mais competitivas."],["shield","Seguro e 100% digital","Da simulação à assinatura, tudo pelo celular ou computador. Seus dados sempre protegidos."]].map(([ico,t,d])=>(
                <div key={t} style={{background:L.card,border:`1px solid ${L.bdrCard}`,borderRadius:16,padding:"20px 22px",display:"flex",gap:16,alignItems:"flex-start",boxShadow:"0 2px 16px #00000009"}}>
                  <div style={{width:44,height:44,borderRadius:12,background:L.bgDark,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <Ico n={ico} s={20} c={L.gold} sw={1.8}/>
                  </div>
                  <div>
                    <div style={{color:L.text,fontWeight:700,fontSize:14,marginBottom:6}}>{t}</div>
                    <div style={{color:L.sub,fontSize:13,lineHeight:1.65}}>{d}</div>
                  </div>
                </div>
              ))}
            </div>
            {/* Photos */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,alignItems:"end"}}>
              <div style={{borderRadius:18,overflow:"hidden",backgroundImage:"url(/img/grupo.jpg)",backgroundSize:"cover",backgroundPosition:"center",aspectRatio:"3/4",backgroundColor:L.bgAlt}}/>
              <div style={{borderRadius:18,overflow:"hidden",backgroundImage:"url(/img/celular.jpg)",backgroundSize:"cover",backgroundPosition:"center top",aspectRatio:"3/5",backgroundColor:L.bgAlt,marginBottom:40}}/>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRODUTOS ── */}
      <section id="produtos" style={{background:L.bgAlt,borderTop:`1px solid ${L.bdr}`,borderBottom:`1px solid ${L.bdr}`,padding:"88px 24px"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:56}}>
            <div style={{display:"inline-flex",background:L.badge,border:`1px solid ${L.bdr}`,borderRadius:20,padding:"5px 16px",marginBottom:20}}>
              <span style={{color:L.badgeText,fontSize:11,fontWeight:700,letterSpacing:1.5}}>PORTFÓLIO COMPLETO</span>
            </div>
            <h2 style={{color:L.text,fontSize:40,fontWeight:900,margin:"0 0 12px",letterSpacing:-.5}}>Qual é a sua <span style={{color:L.gold}}>melhor opção?</span></h2>
            <p style={{color:L.sub,fontSize:14,maxWidth:460,margin:"0 auto",lineHeight:1.7}}>Diferentes produtos para cada momento da sua vida. Simule gratuitamente e compare.</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
            {[{cat:"pf",ico:"user",title:"Pessoa Física",rate:"1,29%",rateLabel:"a.m. · CGI",badge:"Mais popular",items:["Garantia de Imóvel","Garantia de Veículo","FGTS Saque Aniversário","Empréstimo na Conta de Luz","Empréstimo Pessoal"]},{cat:"pj",ico:"building",title:"Pessoa Jurídica",rate:"1,49%",rateLabel:"a.m. · CGI PJ",badge:"",items:["Garantia de Imóvel PJ","Garantia de Veículo PJ","Antecipação de Recebíveis","Capital de Giro"]},{cat:"fin",ico:"bank",title:"Financiamentos",rate:"0,79%",rateLabel:"a.m. · Imobiliário",badge:"Menor taxa",items:["Financiamento Imobiliário","Financiamento de Veículo"]},{cat:"sim",ico:"calc",title:"Simulador Livre",rate:"Grátis",rateLabel:"sem compromisso",badge:"",items:["Compare Price x SAC","Simule qualquer produto","Cálculo real de parcelas"]}].map(({cat:c,ico,title,rate,rateLabel,badge,items})=>(
              <div key={c} style={{background:L.card,border:`1px solid ${badge?L.gold:L.bdrCard}`,borderRadius:20,padding:"24px 20px",display:"flex",flexDirection:"column",position:"relative",overflow:"hidden",boxShadow:badge?"0 4px 24px #c8873a22":"0 2px 12px #00000008"}}>
                {badge&&<div style={{position:"absolute",top:0,right:0,background:L.gold,color:"#ffffff",fontSize:9,fontWeight:800,padding:"4px 12px",borderBottomLeftRadius:10,letterSpacing:.5}}>{badge.toUpperCase()}</div>}
                <div style={{width:42,height:42,borderRadius:12,background:L.bgDark,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16}}>
                  <Ico n={ico} s={20} c={L.gold} sw={1.5}/>
                </div>
                <div style={{color:L.text,fontWeight:800,fontSize:15,marginBottom:4}}>{title}</div>
                <div style={{color:L.gold,fontWeight:900,fontSize:24,lineHeight:1,marginBottom:2}}>{rate}</div>
                <div style={{color:L.sub,fontSize:11,marginBottom:20}}>{rateLabel}</div>
                <div style={{flex:1,marginBottom:20}}>
                  {items.map(it=>(
                    <div key={it} style={{display:"flex",gap:7,alignItems:"center",marginBottom:8}}>
                      <Ico n="check" s={12} c={L.ok} sw={2.5}/>
                      <span style={{color:L.subWarm,fontSize:12}}>{it}</span>
                    </div>
                  ))}
                </div>
                <button onClick={()=>goProduct(c)} style={{background:badge?L.btn:"transparent",border:`1.5px solid ${badge?L.btn:L.bdr}`,borderRadius:8,padding:"10px 16px",color:badge?"#ffffff":L.gold,fontWeight:700,fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                  Simular agora <Ico n="arrow" s={12} c={badge?"#ffffff":L.gold}/>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{padding:"88px 24px",background:L.bg}}>
        <div style={{maxWidth:720,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:48}}>
            <h2 style={{color:L.text,fontSize:40,fontWeight:900,margin:"0 0 10px",letterSpacing:-.5}}>Perguntas Frequentes</h2>
            <p style={{color:L.gold,fontSize:14,margin:0,fontWeight:500}}>Tire suas dúvidas antes de simular</p>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {FAQS.map((f,i)=>(
              <div key={i} style={{background:L.card,border:`1px solid ${openFaq===i?L.gold:L.bdrCard}`,borderRadius:12,overflow:"hidden",transition:"border-color .2s",boxShadow:"0 1px 8px #00000006"}}>
                <button onClick={()=>setOpenFaq(openFaq===i?null:i)} style={{width:"100%",background:"none",border:"none",padding:"17px 22px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",gap:12}}>
                  <span style={{color:L.text,fontSize:14,fontWeight:600,textAlign:"left"}}>{f.q}</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={L.gold} strokeWidth="2.5" strokeLinecap="round" style={{flexShrink:0,transform:openFaq===i?"rotate(180deg)":"none",transition:"transform .25s"}}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                {openFaq===i&&<div style={{padding:"0 22px 18px",borderTop:`1px solid ${L.bdr}`}}><div style={{paddingTop:12,color:L.sub,fontSize:13,lineHeight:1.75}}>{f.a}</div></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{background:L.bgAlt,borderTop:`1px solid ${L.bdr}`,padding:"88px 24px",textAlign:"center"}}>
        <div style={{maxWidth:600,margin:"0 auto"}}>
          <div style={{display:"inline-flex",background:L.badge,border:`1px solid ${L.bdr}`,borderRadius:20,padding:"5px 16px",marginBottom:24}}>
            <span style={{color:L.badgeText,fontSize:11,fontWeight:700,letterSpacing:1.5}}>COMECE AGORA</span>
          </div>
          <h2 style={{color:L.text,fontSize:38,fontWeight:900,lineHeight:1.15,margin:"0 0 14px",letterSpacing:-.5}}>
            Pronto para o próximo<br/>passo da sua <span style={{color:L.gold}}>vida financeira?</span>
          </h2>
          <p style={{color:L.sub,fontSize:14,lineHeight:1.75,margin:"0 0 36px"}}>Simulação gratuita, sem compromisso e sem envio de documentos. Descubra quanto crédito você pode ter em 2 minutos.</p>
          <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
            <button onClick={()=>goProduct("pf")} style={{background:L.btn,border:"none",borderRadius:10,padding:"15px 36px",color:"#ffffff",fontWeight:700,fontSize:15,cursor:"pointer",display:"flex",alignItems:"center",gap:8,boxShadow:"0 4px 24px #1a080022"}}>
              Iniciar simulação gratuita <Ico n="arrow" s={16} c="#ffffff"/>
            </button>
            <button style={{background:"transparent",border:`1.5px solid ${L.bdr}`,borderRadius:10,padding:"15px 24px",color:L.subWarm,fontWeight:500,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",gap:8}}>
              <Ico n="chat" s={15} c={L.subWarm}/>Falar com consultor
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{background:L.bgDark,padding:"36px 24px"}}>
        <div style={{maxWidth:1140,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:32,height:32,background:L.gold,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:13,color:"#1a0800"}}>ZP</div>
            <span style={{color:"#ffffff",fontWeight:700,fontSize:15}}>ZP Pay</span>
          </div>
          <div style={{display:"flex",gap:24}}>
            {[["hero","Início"],["como-funciona","Como Funciona"],["diferenciais","Diferenciais"],["faq","FAQ"]].map(([id,label])=>(
              <a key={id} href="#" onClick={e=>{e.preventDefault();document.getElementById(id)?.scrollIntoView({behavior:"smooth"});}} style={{color:"#9a7a5a",fontSize:12,textDecoration:"none"}}>{label}</a>
            ))}
          </div>
          <p style={{color:"#6a4a2a",fontSize:12,margin:0}}>© 2025 ZP Pay · Crédito sujeito à análise · LGPD</p>
        </div>
      </footer>
    </div>
  );

  // ── PRODUCT ─────────────────────────────────────────────────────────────────
  if(view==="product"){
    const isSim=cat==="sim";
    const activeCat=isSim?simCat:cat;
    const prods=activeCat?(CATS[activeCat]?.products||[]):[];
    const activeProduct=isSim?simProd:product;
    const canContinue=isSim?!!simProd:!!product;
    const handleContinue=()=>{const pid=isSim?simProd:product;if(isSim)setCat(simCat);setProduct(pid);if(pid==="fgts"){setView("contract");setStep(0);}else setView("simform");};
    return innerWrap(
      <>
        <h2 style={{color:G.goldL,fontSize:20,fontWeight:700,marginBottom:6}}>{CATS[cat]?.label||"Simulador"}</h2>
        <p style={{color:G.sub,fontSize:13,marginBottom:24}}>Selecione o produto desejado para iniciar a simulação.</p>
        {isSim&&<Fld label="Tipo de crédito"><select style={S.sel} value={simCat} onChange={e=>{setSimCat(e.target.value);setSimProd("");}}><option value="">Selecione...</option>{Object.entries(CATS).filter(([k])=>k!=="sim").map(([k,v])=><option key={k} value={k}>{v.label}</option>)}</select></Fld>}
        {(!isSim||simCat)&&(
          <>
            {(!isSim)&&<div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
              {prods.map(p=>(
                <button key={p.id} onClick={()=>setProduct(p.id)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:product===p.id?`${G.goldD}44`:G.card,border:`1px solid ${product===p.id?G.gold:G.bdr}`,borderRadius:10,padding:"14px 18px",color:product===p.id?G.goldL:G.text,fontSize:14,cursor:"pointer",textAlign:"left"}}>
                  <span>{p.label}</span>
                  {product===p.id&&<span style={{color:G.gold}}><Ico n="check" s={16} c={G.gold} sw={2.5}/></span>}
                </button>
              ))}
            </div>}
            {isSim&&<Fld label="Produto"><select style={S.sel} value={simProd} onChange={e=>setSimProd(e.target.value)}><option value="">Selecione o produto...</option>{prods.map(p=><option key={p.id} value={p.id}>{p.label}</option>)}</select></Fld>}
          </>
        )}
        <button style={{...S.btn,opacity:canContinue?1:.4,cursor:canContinue?"pointer":"not-allowed",display:"flex",alignItems:"center",justifyContent:"center",gap:8}} onClick={canContinue?handleContinue:undefined}>Continuar <Ico n="arrow" s={16} c="#1a0800"/></button>
      </>
    );
  }

  // ── SIM FORM ────────────────────────────────────────────────────────────────
  if(view==="simform"){
    const pName=CATS[cat]?.products?.find(p=>p.id===product)?.label||"";
    const validate=()=>{
      const e={};
      if((simData.nome||"").trim().split(" ").filter(Boolean).length<2)e.nome="Informe nome completo";
      if((simData.tel||"").replace(/\D/g,"").length<10)e.tel="Telefone inválido";
      const cred=parseMoney(simData.credito);
      if(["cgi_pf","cgi_pj"].includes(product)){const im=parseMoney(simData.imovel);if(im<150000)e.imovel="Mínimo R$150.000,00";if(!cred)e.credito="Obrigatório";else if(cred>im*.5)e.credito="Máximo 50% do imóvel";}
      if(["cgv_pf","cgv_pj"].includes(product)){const v=parseMoney(simData.veiculo);if(v<10000)e.veiculo="Mínimo R$10.000,00";if(!cred)e.credito="Obrigatório";else if(cred>v*.9)e.credito="Máximo 90% do veículo";if(!simData.parcelas)e.parcelas="Selecione as parcelas";}
      if(product==="conta_luz"){if(!simData.companhia)e.companhia="Selecione a companhia";if(!cred)e.credito="Obrigatório";else if(cred>2100)e.credito="Máximo R$2.100,00";}
      if(product==="pessoal"){if((simData.cpf||"").replace(/\D/g,"").length<11)e.cpf="CPF inválido";if(!cred)e.credito="Obrigatório";else if(cred>10000)e.credito="Máximo R$10.000,00";if(!simData.parcelas)e.parcelas="Selecione";}
      if(product==="recebiveis"){const rec=parseMoney(simData.recebivel);if(!cred)e.credito="Obrigatório";else if(cred>rec)e.credito="Não pode ser maior que o recebível";}
      if(["fin_imovel","fin_veiculo"].includes(product)){if(!cred)e.credito="Obrigatório";if(!simData.parcelas)e.parcelas="Selecione";}
      if(product==="capital_giro"&&!cred)e.credito="Obrigatório";
      setErrors(e);return Object.keys(e).length===0;
    };
    return innerWrap(
      <>
        <div style={{background:G.card,borderRadius:10,padding:"12px 14px",marginBottom:20,border:`1px solid ${G.bdr}`}}>
          <div style={{color:G.sub,fontSize:11,marginBottom:2}}>Produto selecionado</div>
          <div style={{color:G.goldL,fontWeight:600,fontSize:14}}>{pName}</div>
        </div>
        <div style={{background:G.card,border:`1px solid ${G.bdr}`,borderRadius:12,padding:"20px 16px"}}>
          <h2 style={{color:G.text,fontSize:17,fontWeight:700,marginBottom:20}}>Dados para Simulação</h2>
          <Fld label="Nome completo" error={errors.nome}><input style={{...S.inp,borderColor:errors.nome?G.err:G.inpBdr}} placeholder="Seu nome completo" value={simData.nome||""} onChange={e=>{sd("nome",e.target.value);clrErr("nome");}}/></Fld>
          <Fld label="Telefone (WhatsApp)" error={errors.tel}><div style={{display:"flex",gap:8}}><div style={{...S.inp,width:80,flexShrink:0,color:G.sub,fontSize:13,textAlign:"center"}}>+55</div><input style={{...S.inp,flex:1,borderColor:errors.tel?G.err:G.inpBdr}} placeholder="(11) 99999-9999" value={simData.tel||""} onChange={e=>{sd("tel",maskTel(e.target.value));clrErr("tel");}}/></div></Fld>
          {["cgi_pf","cgi_pj"].includes(product)&&<><Fld label="Valor aproximado do imóvel" error={errors.imovel}><input style={{...S.inp,borderColor:errors.imovel?G.err:G.inpBdr}} placeholder="R$ 0,00" value={simData.imovel||""} onChange={e=>{sd("imovel",maskMoney(e.target.value));clrErr("imovel");}}/></Fld><Fld label="Quanto você precisa?" error={errors.credito}><input style={{...S.inp,borderColor:errors.credito?G.err:G.inpBdr}} placeholder="R$ 0,00 (máx. 50% do imóvel)" value={simData.credito||""} onChange={e=>{sd("credito",maskMoney(e.target.value));clrErr("credito");}}/></Fld><Fld label="Crédito já solicitado em outro local?"><select style={S.sel} value={simData.outroLocal||""} onChange={e=>sd("outroLocal",e.target.value)}><option value="">Selecione...</option><option value="nao">Não</option><option value="sim">Sim</option></select></Fld>{simData.outroLocal==="sim"&&<Fld label="Onde foi solicitado?"><input style={S.inp} placeholder="Instituição — valor" value={simData.outroLocalInfo||""} onChange={e=>sd("outroLocalInfo",e.target.value)}/></Fld>}</>}
          {["cgv_pf","cgv_pj"].includes(product)&&<><Fld label="Valor do veículo (garantia)" error={errors.veiculo}><input style={{...S.inp,borderColor:errors.veiculo?G.err:G.inpBdr}} placeholder="R$ 0,00" value={simData.veiculo||""} onChange={e=>{sd("veiculo",maskMoney(e.target.value));clrErr("veiculo");}}/></Fld><Fld label="Valor do crédito" error={errors.credito}><input style={{...S.inp,borderColor:errors.credito?G.err:G.inpBdr}} placeholder="R$ 0,00 (máx. 90%)" value={simData.credito||""} onChange={e=>{sd("credito",maskMoney(e.target.value));clrErr("credito");}}/></Fld><Fld label="Parcelas" error={errors.parcelas}><select style={{...S.sel,borderColor:errors.parcelas?G.err:G.inpBdr}} value={simData.parcelas||""} onChange={e=>{sd("parcelas",e.target.value);clrErr("parcelas");}}><option value="">Selecione...</option>{["15","25","35","45","60","90"].map(p=><option key={p} value={p}>{p}x</option>)}</select></Fld></>}
          {product==="conta_luz"&&<><Fld label="Companhia de energia" error={errors.companhia}><select style={{...S.sel,borderColor:errors.companhia?G.err:G.inpBdr}} value={simData.companhia||""} onChange={e=>{sd("companhia",e.target.value);clrErr("companhia");}}><option value="">Selecione...</option>{COMPANHIAS.map(c=><option key={c}>{c}</option>)}</select></Fld><Fld label="Valor do crédito (máx. R$2.100,00)" error={errors.credito}><input style={{...S.inp,borderColor:errors.credito?G.err:G.inpBdr}} placeholder="R$ 0,00" value={simData.credito||""} onChange={e=>{sd("credito",maskMoney(e.target.value));clrErr("credito");}}/></Fld></>}
          {product==="pessoal"&&<><Fld label="CPF" error={errors.cpf}><input style={{...S.inp,borderColor:errors.cpf?G.err:G.inpBdr}} placeholder="000.000.000-00" value={simData.cpf||""} onChange={e=>{sd("cpf",maskCPF(e.target.value));clrErr("cpf");}}/></Fld><Fld label="Valor do crédito (máx. R$10.000,00)" error={errors.credito}><input style={{...S.inp,borderColor:errors.credito?G.err:G.inpBdr}} placeholder="R$ 0,00" value={simData.credito||""} onChange={e=>{sd("credito",maskMoney(e.target.value));clrErr("credito");}}/></Fld><Fld label="Parcelas" error={errors.parcelas}><select style={{...S.sel,borderColor:errors.parcelas?G.err:G.inpBdr}} value={simData.parcelas||""} onChange={e=>{sd("parcelas",e.target.value);clrErr("parcelas");}}><option value="">Selecione...</option>{["6","12","18","24","36","48"].map(p=><option key={p} value={p}>{p}x</option>)}</select></Fld></>}
          {product==="recebiveis"&&<><Fld label="Tipo de recebível"><select style={S.sel} value={simData.tipoRec||""} onChange={e=>sd("tipoRec",e.target.value)}><option value="">Selecione...</option>{["Maquininha (cartão)","Boleto bancário","Nota Fiscal (NFe)","Contrato a receber","Duplicata"].map(t=><option key={t}>{t}</option>)}</select></Fld><Fld label="Valor total do recebível"><input style={S.inp} placeholder="R$ 0,00" value={simData.recebivel||""} onChange={e=>sd("recebivel",maskMoney(e.target.value))}/></Fld><Fld label="Valor do crédito" error={errors.credito}><input style={{...S.inp,borderColor:errors.credito?G.err:G.inpBdr}} placeholder="R$ 0,00" value={simData.credito||""} onChange={e=>{sd("credito",maskMoney(e.target.value));clrErr("credito");}}/></Fld></>}
          {product==="capital_giro"&&<Fld label="Valor do crédito" error={errors.credito}><input style={{...S.inp,borderColor:errors.credito?G.err:G.inpBdr}} placeholder="R$ 0,00" value={simData.credito||""} onChange={e=>{sd("credito",maskMoney(e.target.value));clrErr("credito");}}/></Fld>}
          {["fin_imovel","fin_veiculo"].includes(product)&&<><Fld label="Valor da entrada"><input style={S.inp} placeholder="R$ 0,00" value={simData.entrada||""} onChange={e=>sd("entrada",maskMoney(e.target.value))}/></Fld><Fld label="Valor do financiamento" error={errors.credito}><input style={{...S.inp,borderColor:errors.credito?G.err:G.inpBdr}} placeholder="R$ 0,00" value={simData.credito||""} onChange={e=>{sd("credito",maskMoney(e.target.value));clrErr("credito");}}/></Fld><Fld label="Parcelas" error={errors.parcelas}><select style={{...S.sel,borderColor:errors.parcelas?G.err:G.inpBdr}} value={simData.parcelas||""} onChange={e=>{sd("parcelas",e.target.value);clrErr("parcelas");}}><option value="">Selecione...</option>{(product==="fin_imovel"?["80","180","220","230","240"]:["15","25","35","45","60","90"]).map(p=><option key={p} value={p}>{p}x</option>)}</select></Fld></>}
          <button style={{...S.btn,display:"flex",alignItems:"center",justifyContent:"center",gap:8}} onClick={()=>{if(validate()){setResult(calcResult(product,simData));setView("simresult");}}}>Calcular <Ico n="arrow" s={16} c="#1a0800"/></button>
        </div>
      </>
    );
  }

  // ── SIM RESULT ──────────────────────────────────────────────────────────────
  if(view==="simresult") return innerWrap(
    <>
      <div style={{background:`${G.goldD}33`,border:`1px solid ${G.goldD}`,borderRadius:10,padding:"12px 16px",marginBottom:16,display:"flex",gap:10,alignItems:"center"}}>
        <div style={{width:32,height:32,borderRadius:"50%",background:G.gold,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ico n="check" s={18} c="#1a0800" sw={2.5}/></div>
        <div><div style={{color:G.goldL,fontWeight:600,fontSize:14}}>Simulação realizada</div><div style={{color:G.sub,fontSize:12}}>Valores estimados. Taxa real definida após análise de crédito.</div></div>
      </div>
      <div style={{background:G.card,borderRadius:12,padding:"20px 16px",border:`1px solid ${G.bdr}`,marginBottom:16}}>
        {result&&result.type==="cgi"&&<>
          <div style={{display:"flex",gap:8,marginBottom:16}}>
            {["price","sac"].map(m=><button key={m} style={{flex:1,background:modal===m?G.gold:G.bdr,border:"none",borderRadius:8,padding:"9px",color:modal===m?"#1a0800":G.text,cursor:"pointer",fontWeight:700,fontSize:13}} onClick={()=>setModal(m)}>{m==="price"?"Tabela Price":"SAC"}</button>)}
          </div>
          {modal==="price"?<><InfoRow label="Modalidade" value="Price — parcelas fixas"/><InfoRow label="Valor do crédito" value={brl(result.pv)}/><InfoRow label="Prazo" value={`${result.n} meses`}/><InfoRow label="Taxa de juros" value={`${result.rate}% a.m.`}/><InfoRow label="Parcela mensal" value={brl(result.price)} highlight/></>:<><InfoRow label="Modalidade" value="SAC — parcelas decrescentes"/><InfoRow label="Valor do crédito" value={brl(result.pv)}/><InfoRow label="Prazo" value={`${result.n} meses`}/><InfoRow label="1ª parcela" value={brl(result.sacPri)} highlight/><InfoRow label="Última parcela" value={brl(result.sacUlt)}/></>}
        </>}
        {result&&result.type==="cgv"&&<><InfoRow label="Valor do crédito" value={brl(result.pv)}/><InfoRow label="Prazo" value={`${result.n}x`}/><InfoRow label="Parcela estimada" value={brl(result.price)} highlight/><div style={{display:"flex",gap:8,alignItems:"flex-start",marginTop:8,color:G.sub,fontSize:12}}><span style={{color:G.goldD,marginTop:1}}><Ico n="warn" s={14} c={G.goldD}/></span><span>Taxa definida após análise de crédito</span></div></>}
        {result&&result.type==="simples"&&<><InfoRow label="Valor do crédito" value={brl(result.pv)}/><InfoRow label="Parcelas" value={`${result.n}x`}/><InfoRow label="Parcela estimada" value={brl(result.price)} highlight/><div style={{display:"flex",gap:8,alignItems:"flex-start",marginTop:8,color:G.sub,fontSize:12}}><span style={{color:G.goldD,marginTop:1}}><Ico n="warn" s={14} c={G.goldD}/></span><span>Taxa definida após análise de crédito</span></div></>}
        {result&&result.type==="fin"&&<><InfoRow label="Entrada" value={brl(result.entrada)}/><InfoRow label="Valor financiado" value={brl(result.pv)}/><InfoRow label="Prazo" value={`${result.n} meses`}/><InfoRow label="Taxa indicativa" value={`${result.rate}% a.m.`}/><InfoRow label="Parcela estimada" value={brl(result.price)} highlight/></>}
        {result&&result.type==="fgts"&&<><InfoRow label="Produto" value="Antecipação Saque Aniversário"/><InfoRow label="Valor" value="Calculado após análise" highlight/><div style={{color:G.sub,fontSize:12,marginTop:8}}>Valor sujeito à margem disponível no FGTS.</div></>}
      </div>
      <button style={{...S.btn,display:"flex",alignItems:"center",justifyContent:"center",gap:8}} onClick={()=>{setStep(0);setView("contract");}}>Contratar agora <Ico n="arrow" s={16} c="#1a0800"/></button>
      <button style={{...S.ghost,marginTop:8}} onClick={()=>setView("simform")}>← Refazer simulação</button>
    </>
  );

  // ── CONTRACT ────────────────────────────────────────────────────────────────
  if(view==="contract"){
    const steps=getContractSteps(product);const isLast=step===steps.length-1;
    const validateStep=()=>{
      const e={};const s=steps[step];
      if(s==="dados_pessoais"){if((cData.nome||"").trim().split(" ").filter(Boolean).length<2)e.nome="Nome completo obrigatório";if((cData.cpf||"").replace(/\D/g,"").length<11)e.cpf="CPF inválido";if(!cData.nascimento)e.nascimento="Obrigatório";else{const age=(new Date()-new Date(cData.nascimento))/(365.25*24*3600*1000);if(age>70)e.nascimento="Limite de 70 anos para esta operação";}if(!(cData.email||"").includes("@"))e.email="E-mail inválido";if((cData.whatsapp||"").replace(/\D/g,"").length<10)e.whatsapp="WhatsApp inválido";}
      if(s==="operacao"){if(!cData.tipoImovel)e.tipoImovel="Selecione";if(!cData.motivo)e.motivo="Selecione";if(!cData.matricula)e.matricula="Obrigatório";}
      if(s==="dados_bancarios"){if(!cData.banco)e.banco="Selecione o banco";if(!/^\d+$/.test(cData.agencia||""))e.agencia="Apenas números";if(!cData.conta)e.conta="Obrigatório";if(!cData.confirmaContaTitular)e.confirmaContaTitular="Confirmação obrigatória";}
      if(s==="dados_empresa"){if(!cData.razaoSocial)e.razaoSocial="Obrigatório";if((cData.cnpj||"").replace(/\D/g,"").length<14)e.cnpj="CNPJ inválido";if(cData.tempoEmpresa==="menos3")e.tempoEmpresa="Empresa precisa ter pelo menos 3 anos";}
      if(["endereco_garantia","endereco_residencial"].includes(s)){if((cData[`${s}_cep`]||"").replace(/\D/g,"").length<8)e[`${s}_cep`]="CEP inválido";if(!cData[`${s}_numero`])e[`${s}_numero`]="Obrigatório";}
      if(s==="renda"){if(!cData.ocupacao)e.ocupacao="Selecione";if(!cData.renda)e.renda="Informe a renda";}
      setErrors(e);return Object.keys(e).length===0;
    };
    return innerWrap(
      <>
        <StepsBar steps={steps} current={step}/>
        <div style={{background:G.card,border:`1px solid ${G.bdr}`,borderRadius:12,padding:"20px 16px"}}>
          <ContractStep stepId={steps[step]} cData={cData} cd={cd} errors={errors} clrErr={clrErr} result={result}/>
          <div style={{marginTop:20}}>
            <button style={{...S.btn,display:"flex",alignItems:"center",justifyContent:"center",gap:8}} onClick={()=>{if(validateStep()){if(isLast)setView("finalizacao");else setStep(s=>s+1);}}}>
              {isLast?<>Finalizar e Enviar <Ico n="check" s={16} c="#1a0800" sw={2.5}/></>:step===0?<>Prosseguir <Ico n="arrow" s={16} c="#1a0800"/></>:<>Salvar e Prosseguir <Ico n="arrow" s={16} c="#1a0800"/></>}
            </button>
            {step>0&&<button style={{...S.ghost,marginTop:8}} onClick={()=>setStep(s=>s-1)}>← Voltar</button>}
          </div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,color:G.muted,fontSize:12,marginTop:10}}><Ico n="lock" s={12} c={G.muted}/>Seus dados são salvos a cada etapa.</div>
        </div>
      </>,580
    );
  }

  // ── FINALIZACAO ──────────────────────────────────────────────────────────────
  if(view==="finalizacao") return innerWrap(
    <div style={{textAlign:"center",paddingTop:32}}>
      <div style={{width:72,height:72,borderRadius:"50%",background:`${G.ok}22`,border:`2px solid ${G.ok}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}><Ico n="check" s={36} c={G.ok} sw={2.5}/></div>
      <h2 style={{color:G.goldL,fontSize:22,fontWeight:800,marginBottom:10}}>Proposta Enviada</h2>
      <p style={{color:G.text,fontSize:14,lineHeight:1.8,marginBottom:8}}>Agradecemos pelo envio das informações e documentos.</p>
      <p style={{color:G.sub,fontSize:13,lineHeight:1.8,marginBottom:28}}>Nossa equipe jurídica e os analistas de crédito darão continuidade à análise. Fique de olho no seu <strong style={{color:G.goldL}}>WhatsApp</strong> e <strong style={{color:G.goldL}}>e-mail</strong>.</p>
      {result&&<div style={{background:G.card,border:`1px solid ${G.bdr}`,borderRadius:12,padding:16,marginBottom:24,textAlign:"left"}}>
        <div style={{color:G.sub,fontSize:12,marginBottom:8}}>Resumo da proposta</div>
        <InfoRow label="Crédito solicitado" value={brl(result.pv||0)}/>
        {result.price&&<InfoRow label="Parcela estimada" value={brl(result.price)} highlight/>}
        {result.n&&<InfoRow label="Prazo" value={`${result.n} meses`}/>}
        <InfoRow label="Taxa indicativa" value={`${result.rate}% a.m.`}/>
      </div>}
      <button style={S.btn} onClick={goHome}>Voltar ao início</button>
    </div>
  );

  return null;
}
