import * as T from 'three';
// Authored procedural surfaces: the reference photographs are not embedded or modified.
function rng(seed){return()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
function canvas(size){const c=document.createElement('canvas');c.width=c.height=size;return c;}
function texture(c,color=false){const t=new T.CanvasTexture(c);if(color)t.colorSpace=T.SRGBColorSpace;t.anisotropy=8;return t;}
function field(n,random){const a=Float32Array.from({length:(n+1)*(n+1)},random);return(x,y)=>{const xx=x*n,yy=y*n,ix=Math.floor(xx),iy=Math.floor(yy);let fx=xx-ix,fy=yy-iy;fx=fx*fx*(3-2*fx);fy=fy*fy*(3-2*fy);const i=iy*(n+1)+ix;return T.MathUtils.lerp(T.MathUtils.lerp(a[i],a[i+1],fx),T.MathUtils.lerp(a[i+n+1],a[i+n+2],fx),fy);};}
export function worn({base=[185,124,38],seed=41,wear=.5,metal=.6,rough=.6,size=512}={}){
 const rand=rng(seed),coarse=field(10,rand),mid=field(38,rand),fine=field(116,rand),c=canvas(size),r=canvas(size),m=canvas(size),b=canvas(size);
 const ctx=c.getContext('2d'),rc=r.getContext('2d'),mc=m.getContext('2d'),bc=b.getContext('2d');const ci=ctx.createImageData(size,size),ri=rc.createImageData(size,size),mi=mc.createImageData(size,size),bi=bc.createImageData(size,size);
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){const u=x/size,v=y/size,k=(y*size+x)*4,n=coarse(u,v),f=mid(u,v),q=fine(u,v),grain=rand();const edge=Math.min(u,v,1-u,1-v);const chip=(n*.45+f*.28+q*.27+Math.exp(-edge*32)*.3)>.79-wear*.17;
 const streak=Math.max(0,coarse(u,Math.min(.999,v*.15))-.55)*.38;const dirt=.72+n*.33+q*.13-streak;const rusty=chip&&f>.33;const rgb=chip?(rusty?[83+q*53,43+f*29,23+q*19]:[105+q*32,102+q*22,86+q*20]):base.map(v=>v*dirt+(grain-.5)*16);
 for(let j=0;j<3;j++){ci.data[k+j]=rgb[j];ri.data[k+j]=255*(chip?.84:rough+q*.14);mi.data[k+j]=255*(rusty?.13:chip?.8:metal);bi.data[k+j]=(chip?96:150)+(q-.5)*38+(grain-.5)*20;}ci.data[k+3]=ri.data[k+3]=mi.data[k+3]=bi.data[k+3]=255;}
 ctx.putImageData(ci,0,0);rc.putImageData(ri,0,0);mc.putImageData(mi,0,0);bc.putImageData(bi,0,0);
 for(let i=0;i<270;i++){let x=rand()*size,y=rand()*size,len=2+rand()*30;ctx.strokeStyle=i%3?'rgba(42,31,21,.30)':'rgba(215,201,160,.38)';ctx.lineWidth=rand()+.3;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+(rand()-.5)*len,y+len);ctx.stroke();}
 const material=new T.MeshStandardMaterial({map:texture(c,true),roughnessMap:texture(r),metalnessMap:texture(m),bumpMap:texture(b),bumpScale:.014,metalness:1,roughness:1});return material;
}
export const yellow=worn({base:[202,142,42],wear:.75,seed:38,metal:.45});
export const ochre=worn({base:[154,107,48],wear:.7,seed:51});
export const steel=worn({base:[157,157,137],wear:.5,metal:.8,rough:.43,seed:31});
export const ivory=worn({base:[195,190,162],wear:.40,metal:.52,rough:.46,seed:19});
export const dark=worn({base:[48,46,39],wear:.48,metal:.7,rough:.6,seed:18});
export const tread=worn({base:[69,61,45],wear:.8,metal:.72,rough:.64,seed:73});
export const rust=worn({base:[99,55,30],wear:.8,metal:.35,rough:.78,seed:5});
export const chrome=new T.MeshStandardMaterial({color:0x878d88,metalness:.94,roughness:.26});
export const rubber=new T.MeshStandardMaterial({color:0x191a17,roughness:.89});
export const glass=new T.MeshPhysicalMaterial({color:0x241326,metalness:.18,roughness:.095,clearcoat:1,clearcoatRoughness:.045,iridescence:.36,iridescenceIOR:1.35,iridescenceThicknessRange:[180,410]});
export function decal(w,h,draw){const c=document.createElement('canvas');c.width=1024;c.height=Math.round(1024*h/w);draw(c.getContext('2d'),c.width,c.height);const mat=new T.MeshStandardMaterial({map:texture(c,true),transparent:true,roughness:.8,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2});return new T.Mesh(new T.PlaneGeometry(w,h),mat);}
export function frontMark(){return decal(1.83,1.23,(g,w,h)=>{const rand=rng(72);g.fillStyle='#756042';g.globalAlpha=.48;g.beginPath();g.moveTo(w*.29,h*.38);g.lineTo(w*.40,h*.24);g.lineTo(w*.56,h*.35);g.lineTo(w*.57,h*.47);g.lineTo(w*.43,h*.44);g.lineTo(w*.36,h*.51);g.closePath();g.fill();g.globalAlpha=.93;g.fillStyle='#24211b';g.font=`900 ${w*.095}px monospace`;g.fillText('WALL·',w*.37,h*.85);g.fillStyle='#983c26';g.beginPath();g.arc(w*.83,h*.80,w*.060,0,Math.PI*2);g.fill();g.fillStyle='#d4cbb2';g.font=`bold ${w*.083}px Arial`;g.fillText('E',w*.80,h*.848);g.globalCompositeOperation='destination-out';for(let i=0;i<4400;i++)g.fillRect(rand()*w,rand()*h,rand()*4+1,rand()*5+1);});}
export function hazard(){return decal(.27,.66,(g,w,h)=>{g.fillStyle='#292923';for(let y=-h;y<h*2;y+=h*.40){g.beginPath();g.moveTo(0,y);g.lineTo(w,y+h*.20);g.lineTo(w,y+h*.39);g.lineTo(0,y+h*.19);g.fill();}const rand=rng(54);g.globalCompositeOperation='destination-out';for(let i=0;i<1300;i++)g.fillRect(rand()*w,rand()*h,rand()*12+2,rand()*20+2);});}
