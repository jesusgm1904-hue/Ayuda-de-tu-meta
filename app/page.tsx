"use client"

import { useState, useEffect } from "react"

export default function Home() {

const [metas,setMetas] = useState<any[]>([])
const [nombreMeta,setNombreMeta] = useState("")
const [objetivo,setObjetivo] = useState("")
const [mostrarForm,setMostrarForm] = useState(false)
const [mostrarHistorial,setMostrarHistorial] = useState(false)


// CARGAR DATOS GUARDADOS
useEffect(()=>{
const data = localStorage.getItem("metas")
if(data){
setMetas(JSON.parse(data))
}
},[])


// GUARDAR DATOS
useEffect(()=>{
localStorage.setItem("metas",JSON.stringify(metas))
},[metas])


// CREAR META
function crearMeta(){

if(!nombreMeta || !objetivo) return

const nuevaMeta={
id:Date.now(),
nombre:nombreMeta,
objetivo:Number(objetivo),
ahorro:0,
historial:[],
input:""
}

setMetas([...metas,nuevaMeta])
setNombreMeta("")
setObjetivo("")
setMostrarForm(false)

}


// AGREGAR DINERO
function agregarDinero(id:number){

setMetas(metas.map(meta=>{

if(meta.id===id){

const valor = Number(meta.input)

if(!valor) return meta

const nuevoAhorro = meta.ahorro + valor

return{
...meta,
ahorro:nuevoAhorro,
historial:[valor,...meta.historial],
input:""
}

}

return meta

}))

}


// ACTUALIZAR INPUT
function actualizarInput(id:number,valor:string){

setMetas(metas.map(meta=>{

if(meta.id===id){
return {...meta,input:valor}
}

return meta

}))

}


// ELIMINAR META
function eliminarMeta(id:number){

setMetas(metas.filter(meta=>meta.id!==id))

}


return (

<div style={{
minHeight:"100vh",
background:"linear-gradient(135deg,#000 50%,#c79b00 50%)",
padding:"40px",
fontFamily:"sans-serif"
}}>


<h1 style={{
color:"#c79b00",
fontSize:"32px",
marginBottom:"30px"
}}>
Meta de ahorro
</h1>


<button onClick={()=>setMostrarForm(!mostrarForm)} style={{
background:"#c79b00",
border:"none",
padding:"10px 20px",
marginBottom:"20px",
cursor:"pointer"
}}>
+ Nueva meta
</button>


{mostrarForm && (

<div style={{marginBottom:"30px"}}>

<input
placeholder="Nombre de meta"
value={nombreMeta}
onChange={e=>setNombreMeta(e.target.value)}
style={{
padding:"10px",
marginRight:"10px",
color:"black",
background:"white",
border:"1px solid #ccc"
}}
/>

<input
placeholder="Cantidad objetivo"
value={objetivo}
onChange={e=>setObjetivo(e.target.value)}
style={{
padding:"10px",
marginRight:"10px",
color:"black",
background:"white",
border:"1px solid #ccc"
}}
/>

<button onClick={crearMeta} style={{
background:"#c79b00",
border:"none",
padding:"10px 20px"
}}>
Agregar meta
</button>

</div>

)}



{metas.map(meta=>{

const progreso = Math.min((meta.ahorro/meta.objetivo)*100,100)

return(

<div key={meta.id} style={{
background:"white",
padding:"25px",
marginBottom:"25px",
borderRadius:"10px"
}}>


<h2 style={{color:"black"}}>
{meta.nombre}
</h2>


<div style={{
display:"flex",
alignItems:"center",
gap:"40px"
}}>


{/* CIRCULO */}

<div style={{
width:"120px",
height:"120px",
borderRadius:"50%",
background:`conic-gradient(#1db954 ${progreso}%, #ccc ${progreso}%)`,
display:"flex",
alignItems:"center",
justifyContent:"center",
fontWeight:"bold",
color:"black"
}}>

{Math.round(progreso)}%

</div>


<div>

<p style={{color:"black"}}>
Ahorro: <b>${meta.ahorro}</b>
</p>

<p style={{color:"black"}}>
Meta: <b>${meta.objetivo}</b>
</p>


{progreso < 100 ? (

<div>

<input
placeholder="Cantidad"
value={meta.input}
onChange={e=>actualizarInput(meta.id,e.target.value)}
style={{
padding:"8px",
color:"black",
background:"white",
border:"1px solid #ccc"
}}
/>

<button
onClick={()=>agregarDinero(meta.id)}
style={{
background:"#c79b00",
border:"none",
padding:"8px 15px",
marginLeft:"10px"
}}
>
Agregar
</button>

</div>

):(

<button
onClick={()=>eliminarMeta(meta.id)}
style={{
background:"green",
color:"white",
border:"none",
padding:"10px 20px"
}}
>

Meta completada ✓ (Eliminar)

</button>

)}

</div>

</div>



{/* HISTORIAL */}

<div style={{marginTop:"20px"}}>

<h3 style={{color:"black"}}>Historial</h3>

{meta.historial
.slice(0,mostrarHistorial ? meta.historial.length : 5)
.map((h:any,i:number)=>{

const color = h>=0 ? "green" : "red"

return(

<div key={i} style={{color}}>
{h>=0?"+":""}{h}

</div>

)

})}

{meta.historial.length>5 &&(

<button
onClick={()=>setMostrarHistorial(!mostrarHistorial)}
style={{
marginTop:"10px",
background:"transparent",
border:"none",
cursor:"pointer"
}}
>

{mostrarHistorial ? "Ver menos" : "Ver más"}

</button>

)}

</div>

</div>

)

})}

</div>

)

}