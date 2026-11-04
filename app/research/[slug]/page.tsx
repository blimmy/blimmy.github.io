import { notFound } from 'next/navigation';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { compileMDX } from 'next-mdx-remote/rsc';
import rehypeHighlight from 'rehype-highlight';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { writeups } from '@/data/writeups';
import Navigation from '@/components/Navigation';
import CodeBlock from '@/components/CodeBlock';
const publicEntries=writeups.filter(w=>w.visible&&w.status!=='draft');
export const dynamicParams=false;
export function generateStaticParams(){return publicEntries.map(w=>({slug:w.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const entry=publicEntries.find(w=>w.slug===slug);return {title:entry?.title??'Record not found',description:entry?.summary,robots:{index:entry?.status==='published',follow:true}}}
export default async function WriteupPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const entry=publicEntries.find(w=>w.slug===slug);if(!entry)notFound();
 const source=await readFile(path.join(process.cwd(),'content/writeups',`${entry.slug}.mdx`),'utf8');
 const {content}=await compileMDX({source,options:{parseFrontmatter:true,mdxOptions:{rehypePlugins:[rehypeHighlight]}},components:{pre:CodeBlock}});
 return <><Navigation/><main className="writeup-page section-pad" id="main"><a className="text-link" href="/#research"><ArrowLeft size={16}/>Back to the archive</a><header className="writeup-header"><span className="eyebrow">RESEARCH ARCHIVE / {entry.status.toUpperCase()}</span><h1>{entry.title}<span className="pink">.</span></h1><p>{entry.summary}</p><div className="writeup-meta mono"><span>{entry.category}</span><span>COMPETITION: {entry.competition??'PENDING'}</span><span>DIFFICULTY: {entry.difficulty??'NOT SUPPLIED'}</span></div>{entry.status==='template'&&<p className="template-notice mono">TEMPLATE PREVIEW — THIS IS NOT A PUBLISHED CTF WRITEUP.</p>}{entry.technologies.length>0&&<p className="mono">TECHNOLOGIES / {entry.technologies.join(' · ')}</p>}{entry.technique&&<p>Technique: {entry.technique}</p>}</header><article className="prose">{content}</article>{entry.github&&<a className="text-link" href={entry.github} target="_blank" rel="noreferrer">View research on GitHub <ArrowUpRight size={16}/></a>}<footer className="writeup-footer mono"><span>&gt; end_of_record</span><a href="/#research">RETURN TO ARCHIVE ↗</a></footer></main></>
}
