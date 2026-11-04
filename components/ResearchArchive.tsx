'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Search, FileCode2 } from 'lucide-react';
import { categories, writeups } from '@/data/writeups';
import { visible } from '@/lib/content';
export default function ResearchArchive(){
 const [category,setCategory]=useState('All');const [search,setSearch]=useState('');
 const entries=visible(writeups).filter(w=>w.status!=='draft'&&(category==='All'||w.category===category)&&`${w.title} ${w.summary} ${w.competition??''}`.toLowerCase().includes(search.toLowerCase()));
 return <><div className="archive-toolbar"><div className="archive-categories" aria-label="Filter writeups">{['All',...categories].map(c=><button key={c} aria-pressed={category===c} onClick={()=>setCategory(c)}>{c}</button>)}</div><label className="archive-search"><Search size={16}/><span className="sr-only">Search research</span><input placeholder="Search the archive" value={search} onChange={e=>setSearch(e.target.value)}/></label></div><div className="archive-table-head mono"><span>RECORD / CHALLENGE</span><span>CATEGORY</span><span>STATUS</span></div><div aria-live="polite">{entries.length?entries.map(w=><Link className="archive-row" href={`/research/${w.slug}/`} key={w.slug}><div><span className="mono archive-number">{String(w.order).padStart(3,'0')} <FileCode2 size={15}/></span><h3>{w.title}</h3><p>{w.summary}</p></div><span className="mono">{w.category}</span><span className="archive-status mono">{w.status==='template'?'TEMPLATE / PENDING':'PUBLISHED'}<ArrowUpRight size={22}/></span></Link>):<div className="archive-empty"><span className="mono">NO PUBLISHED RECORDS</span><h3>{search?'No matching records.':'Research in progress.'}</h3><p>{search?'Try another search or category.':'Writeups in this category will appear here when the research is ready to share.'}</p><button className="text-link" onClick={()=>{setCategory('All');setSearch('')}}>Reset filters <ArrowUpRight size={16}/></button></div>}</div><div className="archive-note mono"><span>PUBLIC KNOWLEDGE / CONTINUOUSLY EVOLVING</span><span>WRITEUPS WILL BE ADDED AFTER REVIEW</span></div></>
}
