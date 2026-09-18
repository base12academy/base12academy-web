import { IMAGENES_BLOQUES, TEXTOS_BLOQUES } from "@/lib/temas";

export type ExamSource={
  sourceId:string;
  source_type:"image"|"text";
  title:string;
  description:string;
  content:string|null;
  asset_url:string|null;
  explanation:string;
};

function normalizeImagePath(value:string){
  if(!value)return "";
  if(value.startsWith("/"))return value;
  return "/images/"+value;
}

export function getExamSourceCatalog():ExamSource[]{
  const items:ExamSource[]=[];
  for(const [blockId,images] of Object.entries(IMAGENES_BLOQUES)){
    images.forEach((img,index)=>items.push({
      sourceId:`${blockId}:image:${index}`,
      source_type:"image",
      title:String(img.titulo||""),
      description:String(img.descripcion||""),
      content:null,
      asset_url:normalizeImagePath(String(img.imagen||"")),
      explanation:String(img.explicacion||""),
    }));
  }
  for(const [blockId,texts] of Object.entries(TEXTOS_BLOQUES)){
    texts.forEach((item,index)=>items.push({
      sourceId:`${blockId}:text:${index}`,
      source_type:"text",
      title:String(item.titulo||""),
      description:String(item.descripcion||""),
      content:String(item.texto||""),
      asset_url:null,
      explanation:String(item.explicacion||""),
    }));
  }
  return items;
}

export function getExamSourceById(sourceId:string){
  return getExamSourceCatalog().find(item=>item.sourceId===sourceId)||null;
}

export function publicExamSource(source:ExamSource){
  const {explanation,...safe}=source;
  return safe;
}
