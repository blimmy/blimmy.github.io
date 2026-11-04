'use client';
import { useState } from 'react';
import { ArrowUpRight, Plus, Minus } from 'lucide-react';
import { skills } from '@/data/skills';
import { visible } from '@/lib/content';
export default function Skills(){
 const [selected,setSelected]=useState<{group:string;skill:string}|null>(null);
 return <div className="skills-list">{visible(skills).map((group,i)=><div className="skill-group" key={group.id}><div className="skill-heading"><span className="mono">0{i+1}</span><h3>{group.title}</h3></div><div className="skill-items">{group.items.map(skill=><button key={skill} aria-expanded={selected?.skill===skill&&selected.group===group.id} aria-controls={`skill-evidence-${group.id}`} onClick={()=>setSelected(selected?.skill===skill&&selected.group===group.id?null:{group:group.id,skill})}>{skill}{selected?.skill===skill&&selected.group===group.id?<Minus size={12}/>:<Plus size={12}/>}</button>)}<div id={`skill-evidence-${group.id}`} className="skill-evidence" hidden={selected?.group!==group.id}><span className="eyebrow">IN PRACTICE / {selected?.skill}</span><p>{group.evidence}</p>{group.link&&<a className="text-link" href={group.link}>Explore the context <ArrowUpRight size={16}/></a>}</div></div></div>)}</div>
}
