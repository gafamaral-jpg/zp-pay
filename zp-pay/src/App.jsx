import { useState } from "react";

const G={bg:"#1e0f06",bgSection:"#160b04",card:"#2a1508",cardHov:"#351c0a",gold:"#d4a96a",goldL:"#e8c99a",goldD:"#8c5f20",text:"#f5ede3",sub:"#b8957a",muted:"#7a5540",err:"#e05555",ok:"#4db87a",bdr:"#3d1f0d",inp:"#180a04",inpBdr:"#4a2818"};

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
const FAQS=[{q:"Quais tipos de crédito posso contratar?",a:"Temos diferentes tipos de crédito, tanto para pessoas físicas quanto jurídicas, incluindo crédito pessoal, empréstimos com garantia, financiamentos e crédito para negócios."},{q:"Preciso comprovar renda ou ter bom score?",a:"Depende da modalidade. Existem opções mais flexíveis, mas cada instituição faz sua própria análise. A simulação é o primeiro passo para entender suas possibilidades."},{q:"Como é a segurança da minha informação?",a:"Trabalhamos com os melhores sistemas de proteção e todos os nossos parceiros são regulamentados pelo Banco Central."},{q:"Quanto tempo leva para o dinheiro cair na minha conta?",a:"Dependendo da modalidade de crédito escolhida, temos algumas opções em que o crédito cai em poucas horas."},{q:"Quais documentos são necessários para solicitar o crédito?",a:"Depende da modalidade escolhida, mas geralmente você precisará de um documento de identidade (RG ou CNH), CPF e comprovante de residência. Para crédito empresarial, será necessário apresentar documentos da empresa."},{q:"O que acontece após a simulação do crédito?",a:"Após a simulação, você receberá as melhores ofertas disponíveis para o seu perfil. Caso queira seguir com a contratação, basta enviar a documentação necessária e aguardar a análise para a aprovação final."},{q:"Tenho que pagar alguma taxa antecipada para liberar o crédito?",a:"Não. Trabalhamos apenas com instituições sérias e regulamentadas. Se alguém solicitar um pagamento antecipado para liberar o crédito, desconfie e nos avise imediatamente."},{q:"Posso antecipar parcelas ou quitar meu crédito antes do prazo?",a:"Sim. A maioria das modalidades permite a quitação antecipada, muitas vezes com desconto nos juros. Consulte as condições específicas da sua oferta."}];
const PARCEIROS=["Itaú","Bradesco","Santander","Creditas","CashMe"];

// Imagens reais do Google Drive (Banco de imagens ZP Pay)
const IMG1="https://lh3.googleusercontent.com/d/1L-MD1WZCBcHTPl9iyTvx3FBWvT53LV2R";
const IMG2="https://lh3.googleusercontent.com/d/1SY2VV9nAWJn1Wh_WZ_H5-1ehyoPPtHcx";
const IMG3="https://lh3.googleusercontent.com/d/11DL2nFQSuD880XIg_Uu1xSEQafDDKs1f";
const IMG4="https://lh3.googleusercontent.com/d/1shX1s5ftHJYhvKpSzYPCUbL2iEaJHzG3";
const IMG5="https://lh3.googleusercontent.com/d/1XhlJLumdPVQlbYcsadk_HdJpreayJpAu";
const IMG6="https://lh3.googleusercontent.com/d/1exZhpZFLLk_Vgdact1dOg7LKMuX_43n4";

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
          {[["Benefícios","beneficios"],["Como funciona","como-funciona"],["Perguntas frequentes","faq"]].map(([l,id])=>(
            <a key={l} href={`#${id}`} onClick={e=>{e.preventDefault();document.getElementById(id)?.scrollIntoView({behavior:"smooth"});}} style={{color:G.sub,fontSize:13,textDecoration:"none"}}>{l}</a>
          ))}
        </div>
        <button onClick={onSimulate} style={{background:G.goldD,border:"none",borderRadius:8,padding:"8px 18px",color:G.goldL,fontSize:13,fontWeight:600,cursor:"pointer",flexShrink:0}}>Consultor ZP Pay</button>
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
    <div style={{background:G.bg,minHeight:"100vh",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"}}>
      <NavBar onSimulate={()=>goProduct("sim")}/>

      {/* HERO */}
      <section id="hero" style={{position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:`url(${IMG1})`,backgroundSize:"cover",backgroundPosition:"center 30%",opacity:.22,filter:"blur(2px)"}}/>
        <div style={{position:"absolute",inset:0,background:`linear-gradient(180deg,${G.bg}cc 0%,${G.bg}ee 60%,${G.bg} 100%)`}}/>
        <div style={{position:"relative",maxWidth:1100,margin:"0 auto",padding:"60px 24px 80px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:60,alignItems:"center"}}>
          <div>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,background:`${G.goldD}33`,border:`1px solid ${G.goldD}`,borderRadius:20,padding:"6px 14px",marginBottom:28}}>
              <Ico n="dot" s={8} c={G.gold}/>
              <span style={{color:G.goldL,fontSize:12,fontWeight:600,letterSpacing:.5}}>SOLUÇÕES DE CRÉDITO</span>
            </div>
            <h1 style={{color:G.text,fontSize:42,fontWeight:800,lineHeight:1.15,margin:"0 0 14px",letterSpacing:-.5}}>
              Precisa de crédito?<br/>
              <span style={{color:G.gold}}>Vamos te ajudar a encontrar</span><br/>
              o melhor caminho.
            </h1>
            <p style={{color:G.sub,fontSize:16,lineHeight:1.7,margin:"0 0 36px",maxWidth:420}}>Compare, simule e contrate com rapidez.</p>
            <div style={{display:"flex",flexDirection:"column",gap:10,maxWidth:320}}>
              {[["pf","Crédito Pessoa Física"],["pj","Crédito Pessoa Jurídica"],["fin","Financiamentos"]].map(([id,label])=>(
                <button key={id} onClick={()=>goProduct(id)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:G.card,border:`1px solid ${G.bdr}`,borderRadius:10,padding:"13px 18px",color:G.text,fontSize:14,fontWeight:500,cursor:"pointer",textAlign:"left"}}>
                  <span>{label}</span>
                  <Ico n="chev" s={16} c={G.gold}/>
                </button>
              ))}
              <button onClick={()=>goProduct("sim")} style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:G.gold,border:"none",borderRadius:10,padding:"13px 18px",color:"#1a0800",fontSize:14,fontWeight:700,cursor:"pointer"}}>
                <span>Simulador</span>
                <Ico n="arrow" s={16} c="#1a0800"/>
              </button>
            </div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,maxWidth:480,marginLeft:"auto"}}>
            <div style={{aspectRatio:"3/4",borderRadius:20,overflow:"hidden",backgroundImage:`url(${IMG2})`,backgroundSize:"cover",backgroundPosition:"center top"}}/>
            <div style={{aspectRatio:"3/4",borderRadius:20,overflow:"hidden",backgroundImage:`url(${IMG4})`,backgroundSize:"cover",backgroundPosition:"center top"}}/>
            <div style={{gridColumn:"1 / span 2",background:`${G.card}dd`,backdropFilter:"blur(8px)",borderRadius:16,padding:"22px 16px",textAlign:"center",border:`1px solid ${G.bdr}`}}>
              <div style={{color:G.goldL,fontWeight:800,fontSize:36,lineHeight:1}}>100%</div>
              <div style={{color:G.sub,fontSize:12,marginTop:6}}>Digital e sem burocracia</div>
            </div>
          </div>
        </div>
      </section>

      {/* SESSÃO 2 — BENEFÍCIOS */}
      <section id="beneficios" style={{maxWidth:1100,margin:"0 auto",padding:"72px 24px"}}>
        <div style={{textAlign:"center",marginBottom:48}}>
          <div style={{color:G.gold,fontSize:12,fontWeight:600,letterSpacing:1,marginBottom:10}}>PROCESSO ÁGIL</div>
          <h2 style={{color:G.text,fontSize:32,fontWeight:800,margin:0,lineHeight:1.2}}>Benefícios de contratar <span style={{color:G.gold}}>crédito aqui</span></h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:14}}>
          {[["zap","Processo simples","e 100% online"],["user","Crédito para","todos os perfis"],["chart","Compare várias","opções de uma vez"],["check","Aumenta suas","chances de aprovação"],["hand","Encontre as","melhores taxas"]].map(([ico,t1,t2])=>(
            <div key={t1} style={{background:G.card,border:`1px solid ${G.bdr}`,borderRadius:14,padding:"22px 16px",textAlign:"center"}}>
              <div style={{width:42,height:42,borderRadius:10,background:`${G.goldD}33`,border:`1px solid ${G.goldD}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}>
                <Ico n={ico} s={20} c={G.gold} sw={1.6}/>
              </div>
              <div style={{color:G.text,fontWeight:600,fontSize:13,lineHeight:1.5}}>{t1}<br/>{t2}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SESSÃO 3 — PARCEIROS */}
      <section style={{background:G.bgSection,borderTop:`1px solid ${G.bdr}`,borderBottom:`1px solid ${G.bdr}`,padding:"56px 24px"}}>
        <div style={{maxWidth:1100,margin:"0 auto",textAlign:"center"}}>
          <p style={{color:G.sub,fontSize:14,margin:"0 0 28px",letterSpacing:.3}}>Parceiros de confiança, oferecendo as melhores condições para você</p>
          <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:16,flexWrap:"wrap",marginBottom:36}}>
            {PARCEIROS.map(p=>(
              <div key={p} style={{background:G.card,border:`1px solid ${G.bdr}`,borderRadius:10,padding:"16px 28px",minWidth:140,textAlign:"center"}}>
                <div style={{color:G.goldL,fontWeight:700,fontSize:16,letterSpacing:.5}}>{p}</div>
              </div>
            ))}
          </div>
          <button onClick={()=>goProduct("sim")} style={{background:G.gold,border:"none",borderRadius:10,padding:"14px 36px",color:"#1a0800",fontWeight:700,fontSize:15,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:10}}>
            Simule seu crédito agora <Ico n="arrow" s={16} c="#1a0800"/>
          </button>
        </div>
      </section>

      {/* SESSÃO 4 — SOLUÇÕES */}
      <section style={{maxWidth:1100,margin:"0 auto",padding:"72px 24px"}}>
        <div style={{textAlign:"center",marginBottom:48}}>
          <div style={{color:G.gold,fontSize:12,fontWeight:600,letterSpacing:1,marginBottom:10}}>PORTFÓLIO COMPLETO</div>
          <h2 style={{color:G.text,fontSize:32,fontWeight:800,margin:0,lineHeight:1.2}}>Soluções completas <span style={{color:G.gold}}>para cada perfil</span></h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18,marginBottom:36}}>
          {[
            {cat:"pf",ico:"user",title:"Crédito Pessoa Física",items:["Saque FGTS","Garantia de imóvel","Garantia de veículo"]},
            {cat:"pj",ico:"building",title:"Crédito Pessoa Jurídica",items:["Capital de giro","Antecipação de recebíveis","Crédito com garantia"]},
            {cat:"fin",ico:"bank",title:"Financiamentos",items:["Imóvel","Veículo"]},
          ].map(({cat:c,ico,title,items})=>(
            <div key={c} style={{background:G.card,border:`1px solid ${G.bdr}`,borderRadius:16,padding:"28px 24px",display:"flex",flexDirection:"column"}}>
              <div style={{width:48,height:48,borderRadius:12,background:`${G.goldD}33`,border:`1px solid ${G.goldD}`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:18}}>
                <Ico n={ico} s={24} c={G.gold} sw={1.6}/>
              </div>
              <div style={{color:G.goldL,fontWeight:700,fontSize:18,marginBottom:16}}>{title}</div>
              <div style={{flex:1,marginBottom:18}}>
                {items.map(it=>(
                  <div key={it} style={{display:"flex",gap:10,alignItems:"center",marginBottom:10}}>
                    <span style={{flexShrink:0,color:G.gold}}><Ico n="check" s={14} c={G.gold} sw={2.2}/></span>
                    <span style={{color:G.text,fontSize:14}}>{it}</span>
                  </div>
                ))}
              </div>
              <button onClick={()=>goProduct(c)} style={{background:"transparent",border:`1px solid ${G.gold}`,borderRadius:8,padding:"10px 20px",color:G.gold,fontWeight:600,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                Ver produtos <Ico n="arrow" s={14} c={G.gold}/>
              </button>
            </div>
          ))}
        </div>
        <div style={{textAlign:"center"}}>
          <button onClick={()=>goProduct("sim")} style={{background:G.gold,border:"none",borderRadius:10,padding:"14px 36px",color:"#1a0800",fontWeight:700,fontSize:15,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:10}}>
            Simular meu crédito <Ico n="arrow" s={16} c="#1a0800"/>
          </button>
        </div>
      </section>

      {/* SESSÃO 5 — COMO FUNCIONA */}
      <section id="como-funciona" style={{background:G.bgSection,borderTop:`1px solid ${G.bdr}`,borderBottom:`1px solid ${G.bdr}`,padding:"72px 24px"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:60,alignItems:"center"}}>
          <div>
            <div style={{color:G.gold,fontSize:12,fontWeight:600,letterSpacing:1,marginBottom:14}}>SIMPLES E TRANSPARENTE</div>
            <h2 style={{color:G.text,fontSize:32,fontWeight:800,margin:"0 0 32px",lineHeight:1.2}}>Como <span style={{color:G.gold}}>funciona</span></h2>
            <div style={{display:"flex",flexDirection:"column",gap:24}}>
              {[["Simule na hora","Veja suas possibilidades imediatamente"],["Escolha se quer avançar","Sem pressão, você decide"],["Nós cuidamos do envio","Sua solicitação é estruturada e enviada para instituições compatíveis"],["Receba retorno","E siga com a contratação, se fizer sentido"]].map(([t,d],i)=>(
                <div key={i} style={{display:"flex",gap:16,alignItems:"flex-start"}}>
                  <div style={{width:36,height:36,borderRadius:"50%",background:G.gold,display:"flex",alignItems:"center",justifyContent:"center",color:"#1a0800",fontWeight:800,fontSize:15,flexShrink:0}}>{i+1}</div>
                  <div>
                    <div style={{color:G.goldL,fontWeight:700,fontSize:15,marginBottom:4}}>{t}</div>
                    <div style={{color:G.sub,fontSize:13,lineHeight:1.6}}>{d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{position:"relative",aspectRatio:"4/5",borderRadius:20,overflow:"hidden",backgroundImage:`url(${IMG6})`,backgroundSize:"cover",backgroundPosition:"center top",border:`1px solid ${G.bdr}`}}>
            <div style={{position:"absolute",inset:0,background:`linear-gradient(180deg,transparent 55%,${G.bg}cc 100%)`}}/>
          </div>
        </div>
      </section>

      {/* SESSÃO 6 — VANTAGEM */}
      <section style={{maxWidth:1100,margin:"0 auto",padding:"72px 24px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1.1fr 1fr",gap:48,alignItems:"center"}}>
          <div>
            <div style={{color:G.gold,fontSize:12,fontWeight:600,letterSpacing:1,marginBottom:14}}>UM ÚNICO LUGAR</div>
            <h2 style={{color:G.text,fontSize:32,fontWeight:800,margin:"0 0 18px",lineHeight:1.2}}>Você não precisa sair <span style={{color:G.gold}}>buscando banco por banco</span></h2>
            <p style={{color:G.sub,fontSize:15,lineHeight:1.7,margin:"0 0 28px"}}>Aqui você centraliza tudo. Isso reduz erro, tempo e custo na escolha do crédito.</p>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              {[["chart","Mais opções"],["zap","Mais velocidade"],["hand","Mais controle sobre sua decisão"]].map(([ico,t])=>(
                <div key={t} style={{display:"flex",gap:14,alignItems:"center"}}>
                  <div style={{width:40,height:40,borderRadius:10,background:`${G.goldD}33`,border:`1px solid ${G.goldD}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <Ico n={ico} s={18} c={G.gold} sw={1.8}/>
                  </div>
                  <div style={{color:G.text,fontSize:15,fontWeight:600}}>{t}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{position:"relative",aspectRatio:"4/5",borderRadius:20,overflow:"hidden",backgroundImage:`url(${IMG3})`,backgroundSize:"cover",backgroundPosition:"center",backgroundColor:G.card,border:`1px solid ${G.bdr}`}}>
            <div style={{position:"absolute",inset:0,background:`linear-gradient(180deg,transparent 50%,${G.bg}dd 100%)`}}/>
            <div style={{position:"absolute",bottom:20,left:20,right:20,background:`${G.card}dd`,backdropFilter:"blur(8px)",borderRadius:12,padding:"16px 18px",border:`1px solid ${G.bdr}`}}>
              <div style={{color:G.goldL,fontWeight:700,fontSize:15,marginBottom:4}}>Mais opções para você</div>
              <div style={{color:G.sub,fontSize:12}}>Compare condições de várias instituições em um único lugar</div>
            </div>
          </div>
        </div>
      </section>

      {/* SESSÃO 7 — FAQ */}
      <section id="faq" style={{background:G.bgSection,borderTop:`1px solid ${G.bdr}`,padding:"72px 24px"}}>
        <div style={{maxWidth:780,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:48}}>
            <div style={{color:G.gold,fontSize:12,fontWeight:600,letterSpacing:1,marginBottom:10}}>TIRE SUAS DÚVIDAS</div>
            <h2 style={{color:G.text,fontSize:32,fontWeight:800,margin:0,lineHeight:1.2}}>Perguntas <span style={{color:G.gold}}>frequentes</span></h2>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {FAQS.map((f,i)=>(
              <div key={i} style={{background:G.card,border:`1px solid ${openFaq===i?G.goldD:G.bdr}`,borderRadius:12,overflow:"hidden"}}>
                <button onClick={()=>setOpenFaq(openFaq===i?null:i)} style={{width:"100%",background:"none",border:"none",padding:"18px 22px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",color:G.text,fontSize:14,fontWeight:600,textAlign:"left",gap:14}}>
                  <span>{f.q}</span>
                  <span style={{color:G.gold,flexShrink:0,fontSize:24,fontWeight:300,transform:openFaq===i?"rotate(45deg)":"none",transition:"transform .2s",lineHeight:1}}>+</span>
                </button>
                {openFaq===i&&<div style={{padding:"0 22px 18px",color:G.sub,fontSize:13,lineHeight:1.8,borderTop:`1px solid ${G.bdr}`}}><div style={{paddingTop:14}}>{f.a}</div></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{position:"relative",overflow:"hidden",borderTop:`1px solid ${G.bdr}`,padding:"80px 24px",textAlign:"center"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:`url(${IMG5})`,backgroundSize:"cover",backgroundPosition:"center 30%",opacity:.15,filter:"blur(3px)"}}/>
        <div style={{position:"absolute",inset:0,background:`linear-gradient(180deg,${G.bg}bb 0%,${G.bg}ee 100%)`}}/>
        <div style={{position:"relative",maxWidth:640,margin:"0 auto"}}>
          <h2 style={{color:G.text,fontSize:30,fontWeight:800,margin:"0 0 14px",lineHeight:1.2}}>Encontre o <span style={{color:G.gold}}>melhor caminho</span> para o seu crédito</h2>
          <p style={{color:G.sub,fontSize:15,lineHeight:1.7,margin:"0 0 32px"}}>Compare opções, simule sem compromisso e contrate com rapidez. Tudo em um único lugar.</p>
          <div style={{display:"flex",justifyContent:"center"}}>
            <button onClick={()=>goProduct("sim")} style={{background:G.gold,border:"none",borderRadius:10,padding:"14px 36px",color:"#1a0800",fontWeight:700,fontSize:15,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:8}}>Simular agora <Ico n="arrow" s={16} c="#1a0800"/></button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{borderTop:`1px solid ${G.bdr}`,padding:"32px 24px",textAlign:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,justifyContent:"center",marginBottom:12}}>
          <div style={{width:28,height:28,background:G.gold,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:12,color:"#1a0800"}}>ZP</div>
          <span style={{color:G.goldL,fontWeight:700,fontSize:14}}>ZP Pay</span>
        </div>
        <p style={{color:G.muted,fontSize:12,margin:0}}>© 2025 ZP Pay. Todos os direitos reservados. Crédito sujeito à análise.</p>
      </footer>
    </div>
  );

  // ── PRODUCT ─────────────────────────────────────────────────────────────────
  if(view==="product"){
    const isSim=cat==="sim";
    const activeCat=isSim?simCat:cat;
    const prods=activeCat?(CATS[activeCat]?.products||[]):[];
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
      <Fld label="Placa"><input style={S.inp} placeholder="ABC-1234" value={cData.placaVeiculo||""} onChange={e=>cd("placaVeiculo",e.target.value.toUpperCase().slice(0,8))}/></Fld>
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
      <Fld label="Nome completo"><input style={S.inp} value={cData.nomeSocio||""} onChange={e=>cd("nomeSocio",e.target.value)}/></Fld>
      <Fld label="CPF do sócio"><input style={S.inp} placeholder="000.000.000-00" value={cData.cpfSocio||""} onChange={e=>cd("cpfSocio",maskCPF(e.target.value))}/></Fld>
      <Fld label="Participação (%)"><input style={S.inp} placeholder="Ex: 50" value={cData.participacao||""} onChange={e=>cd("participacao",e.target.value.replace(/\D/g,""))}/></Fld>
      <Fld label="E-mail do sócio"><input style={S.inp} placeholder="email@empresa.com" value={cData.emailSocio||""} onChange={e=>cd("emailSocio",e.target.value)}/></Fld>
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
      <p style={{color:G.sub,fontSize:13,lineHeight:1.7,marginBottom:16}}>Nossa equipe entrará em contato para dar continuidade à proposta.</p>
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
