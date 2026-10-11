import * as T from 'three';
import {RoundedBoxGeometry} from './vendor/RoundedBoxGeometry.js';
import * as M from './materials.js';
const geoCache=new Map();
function mesh(g,m,p,xyz=[0,0,0]){const o=new T.Mesh(g,m);o.position.set(...xyz);o.castShadow=o.receiveShadow=true;p.add(o);return o;}
function box(p,w,h,d,m,xyz,r=.025){const key=[w,h,d,r].join(',');if(!geoCache.has(key))geoCache.set(key,new RoundedBoxGeometry(w,h,d,2,Math.min(r,w/3,h/3,d/3)));return mesh(geoCache.get(key),m,p,xyz);}
function cyl(p,r,h,m,xyz,axis='z'){const o=mesh(new T.CylinderGeometry(r,r,h,24),m,p,xyz);if(axis==='z')o.rotation.x=Math.PI/2;if(axis==='x')o.rotation.z=Math.PI/2;return o;}
function bolt(p,xyz,r=.024,axis='z'){const o=cyl(p,r,.025,M.dark,xyz,axis);const slot=box(o,r*1.2,.009,.007,M.chrome,[0,.018,0],.001);return o;}
function rod(p,a,b,r,m){const av=new T.Vector3(...a),bv=new T.Vector3(...b);const o=mesh(new T.CylinderGeometry(r,r,av.distanceTo(bv),16),m,p);o.position.copy(av).add(bv).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),bv.sub(av).normalize());return o;}
function tube(p,pts,r=.035,m=M.rubber){return mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts.map(a=>new T.Vector3(...a))),24,r,8,false),m,p);}
function rim(p,r,z,m=M.chrome,thick=.012){return mesh(new T.TorusGeometry(r,thick,8,48),m,p,[0,0,z]);}
export function createRobot(){
 // Tread units sit just outside the body, so the body can lower between them in a deep squat.
 const TRACK_X=1.37;
 const root=new T.Group(),suspension=new T.Group();root.add(suspension);const wheels=[],links=[],eyes=[],arms=[];
 // An asymmetric, rounded triangular track loop follows the three drive/idler positions.
 const path=new T.Path();path.moveTo(-.22,1.24);path.quadraticCurveTo(-.07,1.24,.05,1.08);path.lineTo(.91,.56);path.quadraticCurveTo(1.17,.29,.78,.115);path.lineTo(-.71,.115);path.quadraticCurveTo(-1.13,.12,-1.12,.53);path.quadraticCurveTo(-1.10,.76,-.48,1.12);path.quadraticCurveTo(-.35,1.24,-.22,1.24);const length=path.getLength();
 for(const side of [-1,1]){const track=new T.Group();track.position.x=side*TRACK_X;root.add(track);box(track,.34,.43,1.44,M.dark,[0,.52,-.15]);
  rod(track,[side*.16,.45,-.72],[side*.16,.98,-.22],.08,M.rust);rod(track,[side*.16,.98,-.22],[side*.16,.36,.74],.07,M.rust);
  for(const [z,y,r] of [[-.71,.51,.36],[.76,.37,.26],[-.22,1.00,.19],[.18,.38,.14]]){const wheel=new T.Group();wheel.position.set(side*.16,y,z);track.add(wheel);cyl(wheel,r,.10,M.tread,[0,0,0],'x');cyl(wheel,r*.81,.12,M.ochre,[side*.012,0,0],'x');cyl(wheel,r*.62,.135,M.dark,[side*.02,0,0],'x');cyl(wheel,r*.46,.15,M.steel,[side*.03,0,0],'x');cyl(wheel,r*.20,.175,M.rust,[side*.05,0,0],'x');for(let i=0;i<8;i++){const a=i*Math.PI/4;bolt(wheel,[side*.087,Math.sin(a)*r*.68,Math.cos(a)*r*.68],.022,'x');}wheels.push({wheel,r,side});}
  for(let i=0;i<38;i++){const shoe=new T.Group();track.add(shoe);box(shoe,.40,.064,.115,M.tread,[0,0,0],.009);for(const s of [-1,1]){const rib=box(shoe,.17,.040,.027,M.steel,[s*.09,.05,0],.005);rib.rotation.y=s*.32;box(shoe,.055,.055,.07,M.rust,[s*.155,.023,.065],.006);}box(shoe,.060,.048,.09,M.dark,[0,-.047,0],.006);links.push({shoe,phase:i/38,side});}
 }
 // Visible suspension and belly mechanics between the tracks.
 box(root,1.12,.38,1.1,M.dark,[0,.76,0]);for(const side of [-1,1]){cyl(root,.16,.57,M.rust,[side*.68,.64,-.10],'x');rod(root,[side*.42,.77,-.45],[side*1.15,.65,.35],.10,M.dark);}
 const body=new T.Group();body.position.y=1.74;suspension.add(body);
 box(body,2.00,1.66,1.65,M.yellow,[0,0,0],.07);box(body,1.90,.49,1.60,M.dark,[0,.61,0]);
 // Lower compacting door, raised frame, grooves and damaged stencil.
 box(body,1.85,1.20,.095,M.yellow,[0,-.23,.853],.045);const mark=M.frontMark();mark.position.set(0,-.23,.906);body.add(mark);
 for(const x of [-.83,.83])box(body,.042,1.08,.025,M.rust,[x,-.24,.912]);for(const x of [-.55,0,.55]){box(body,.025,.47,.022,M.rust,[x,.05,.913],.004);box(body,.011,.42,.029,M.ochre,[x+.018,.06,.916],.003);}
 for(const side of [-1,1]){box(body,.17,.30,.18,M.dark,[side*.92,-.70,.78]);box(body,.07,1.55,.08,M.steel,[side*.96,0,.85]);}
 // Silver upper chest, grilles, red switch, and vertically stacked charge bars.
 box(body,1.82,.48,.08,M.ivory,[0,.62,.855]);for(const x of [-.76,.73])box(body,.23,.38,.025,M.steel,[x,.62,.907]);
 box(body,1.06,.43,.07,M.rust,[.05,.61,.916]);box(body,.48,.39,.04,M.dark,[.30,.61,.96]);box(body,.44,.23,.035,M.dark,[-.24,.71,.96]);
 for(let i=0;i<4;i++)box(body,.38,.017,.025,M.ochre,[-.24,.64+i*.046,.987],.003);for(const x of [-.36,-.23,-.10])box(body,.014,.20,.026,M.steel,[x,.711,.988],.002);
 box(body,.13,.11,.025,M.dark,[-.33,.48,.963]);cyl(body,.04,.018,new T.MeshStandardMaterial({color:0x711e0e,roughness:.38}),[-.33,.48,.99]);
 const glow=new T.MeshStandardMaterial({color:0xded563,emissive:0xc7a827,emissiveIntensity:.45,roughness:.6});
 const heading=M.decal(.40,.044,(g,w,h)=>{g.fillStyle='#d6d171';g.font=`bold ${h*.79}px Arial`;g.fillText('SOLAR CHARGE LEVEL',0,h*.85);});heading.position.set(.30,.769,.987);body.add(heading);
 for(let i=0;i<8;i++)box(body,.19,.020,.012,glow,[.34,.46+i*.033,.988],.002);cyl(body,.036,.012,glow,[.17,.697,.988]);for(let i=0;i<8;i++){const a=i*Math.PI/4;const ray=box(body,.008,.020,.01,glow,[.17+Math.sin(a)*.053,.697+Math.cos(a)*.053,.988],.001);ray.rotation.z=-a;}
 for(const x of [-.47,.56])for(const y of [.43,.80])bolt(body,[x,y,.963],.018);
 // Top seam and folded panel lids.
 box(body,2.08,.065,1.77,M.steel,[0,.862,0],.013);for(const side of [-1,1]){box(body,.84,.035,1.58,M.yellow,[side*.53,.904,0],.014);box(body,.024,.022,1.56,M.rust,[side*.11,.930,0],.004);for(const z of [-.64,.64])box(body,.18,.06,.10,M.dark,[side*.51,.93,z]);}
 for(const side of [-1,1]){const panel=new T.Group();panel.position.x=side*1.014;panel.rotation.y=side*Math.PI/2;body.add(panel);box(panel,1.38,1.28,.027,M.dark,[0,-.04,0]);box(panel,1.24,1.12,.035,M.yellow,[0,-.06,.02]);for(const y of [-.59,.48])box(panel,1.29,.045,.04,M.steel,[0,y,.05]);for(const x of [-.62,.62])box(panel,.038,1.1,.04,M.ochre,[x,-.05,.05]);box(panel,1.04,.18,.05,M.dark,[0,.49,.058]);for(let i=0;i<3;i++)box(panel,.98,.019,.02,M.rust,[0,.44+i*.045,.09]);cyl(panel,.14,.055,M.ochre,[-.44,.16,.079]);bolt(panel,[-.44,.16,.12],.058);}
 box(body,1.60,1.25,.065,M.dark,[0,-.03,-.857]);for(let i=0;i<5;i++)box(body,.045,1.09,.03,M.rust,[-.60+i*.30,-.03,-.90]);
 // Articulated arms (shoulder mount, striped upper arm, elbow, piston forearm, wrist, and a hand
 // with two jointed fingers and an opposing thumb). At rest the hands are held forward, in front
 // of the body and clear of the treads, as in the reference pictures.
 const ARM_X=1.075,ARM_Y=2.02,ARM_Z=.30;
 // Clasped-hands pose (found numerically: hands meet in front of the chest, nothing touches).
 const CLASP={sx:-.535,sy:-1.072,sz:-.048,ex:-1.721,wx:.328,wy:-1.277,wz:.858,slide:.5,ext:.344,dsx:0,dex:0,dslide:0};
 for(const side of [-1,1]){
  const mount=new T.Group();mount.position.set(side*ARM_X,ARM_Y,ARM_Z);suspension.add(mount);
  box(mount,.05,.40,.46,M.dark,[0,0,0],.012);for(const z of [-.16,.16])bolt(mount,[side*.03,.13,z],.02,'x');
  cyl(mount,.15,.10,M.ochre,[side*.07,0,0],'x');
  const shoulder=new T.Group();shoulder.position.set(side*.20,0,0);mount.add(shoulder);
  cyl(shoulder,.115,.17,M.dark,[0,0,0],'x');bolt(shoulder,[side*.095,0,0],.05,'x');
  box(shoulder,.23,.58,.25,M.yellow,[0,-.32,0]);
  const stripes=M.hazard();stripes.scale.set(.85,.88,1);stripes.position.set(0,-.33,.128);shoulder.add(stripes);
  const sideStripes=M.hazard();sideStripes.scale.set(.92,.88,1);sideStripes.position.set(side*.118,-.33,0);sideStripes.rotation.y=side*Math.PI/2;shoulder.add(sideStripes);
  for(const y of [-.10,-.55])bolt(shoulder,[0,y,.135],.022);
  const elbow=new T.Group();elbow.position.set(0,-.62,0);shoulder.add(elbow);
  cyl(elbow,.105,.26,M.dark,[0,0,0],'x');for(const s2 of [-1,1])bolt(elbow,[s2*.135,0,0],.045,'x');
  box(elbow,.19,.20,.19,M.ochre,[0,-.13,0],.02);
  cyl(elbow,.062,.30,M.chrome,[0,-.33,0],'y');cyl(elbow,.085,.05,M.dark,[0,-.235,0],'y');
  rod(elbow,[side*.07,-.06,-.085],[side*.06,-.44,-.07],.018,M.chrome);
  const wrist=new T.Group();wrist.position.set(0,-.50,0);wrist.scale.setScalar(1.25);elbow.add(wrist);
  cyl(wrist,.09,.10,M.dark,[0,0,0],'y');box(wrist,.30,.17,.21,M.ivory,[0,-.12,0],.03);box(wrist,.22,.05,.17,M.steel,[0,-.03,0],.01);
  const fingers=[];
  // Two fingers on the top side of the palm and a thumb underneath, each with two phalanges.
  for(const [dx,dz,dir] of [[-.075,.045,1],[.075,.045,1],[0,-.07,-1]]){
   const prox=new T.Group();prox.position.set(dx,-.205,dz);wrist.add(prox);
   box(prox,dir>0?.12:.14,.17,.11,M.ivory,[0,-.075,0],.02);cyl(prox,.045,dir>0?.13:.15,M.dark,[0,-.16,0],'x');
   const dist=new T.Group();dist.position.set(0,-.165,0);prox.add(dist);
   box(dist,dir>0?.115:.135,.13,.105,M.ivory,[0,-.06,0],.02);box(dist,dir>0?.09:.11,.10,.02,M.rubber,[0,-.065,-dir*.055],.006);
   fingers.push({prox,dist,dir});
  }
  arms.push({mount,shoulder,elbow,wrist,fingers,side});
 }
 // S-shaped neck linkage: base swivel, inclined lower segment, hinge and upper fork.
 // Folding neck: the base swivel stays seated on the body; a lower link and an upper fork fold
 // like an accordion (solved with two-link inverse kinematics), so the head lowers without
 // entering the body.
 const neck=new T.Group();neck.position.set(0,2.66,-.11);suspension.add(neck);cyl(neck,.20,.16,M.dark,[0,.02,0],'y');cyl(neck,.165,.12,M.ochre,[0,.12,0],'y');
 const NECK_J0=new T.Vector2(.13,0),NECK_L1=Math.hypot(.31,.17),NECK_L2=Math.hypot(.48,.32);
 const lower=new T.Group();lower.position.set(0,NECK_J0.x,NECK_J0.y);neck.add(lower);
 rod(lower,[0,0,0],[0,NECK_L1,0],.115,M.ochre);cyl(lower,.15,.40,M.ochre,[0,NECK_L1,0],'x');
 for(const side of [-1,1]){cyl(lower,.107,.024,M.steel,[side*.211,NECK_L1,0],'x');bolt(lower,[side*.228,NECK_L1,0],.063,'x');rod(lower,[side*.08,.04,.11],[side*.08,NECK_L1-.05,.11],.029,M.chrome);}
 const upper=new T.Group();upper.position.set(0,NECK_L1,0);lower.add(upper);
 for(const side of [-1,1])rod(upper,[side*.115,.02,0],[side*.115,NECK_L2-.17,0],.075,M.ochre);
 box(upper,.30,.22,.21,M.ochre,[0,NECK_L2-.16,-.02]);cyl(upper,.105,.44,M.dark,[0,NECK_L2-.08,-.02],'x');
 const head=new T.Group();head.position.set(0,NECK_L2,0);upper.add(head);
 // Head pivot targets in neck coordinates (y, z): rest pose and lowered "mind your head" pose.
 const HEAD_REST=new T.Vector2(.92,.15),HEAD_DUCK=new T.Vector2(.65,.06);
 function solveNeck(target){const d=target.clone().sub(NECK_J0),D=Math.min(d.length(),NECK_L1+NECK_L2-1e-4),phi=Math.atan2(d.y,d.x);
  const alpha=Math.acos(T.MathUtils.clamp((NECK_L1*NECK_L1+D*D-NECK_L2*NECK_L2)/(2*NECK_L1*D),-1,1));const a1=phi-alpha;
  const hinge=new T.Vector2(NECK_J0.x+NECK_L1*Math.cos(a1),NECK_J0.y+NECK_L1*Math.sin(a1));const v=target.clone().sub(hinge);return[a1,Math.atan2(v.y,v.x)-a1];}box(head,.95,.14,.21,M.dark,[0,-.07,-.12]);
 // Mirrored binocular housings: pointed inner brows, drooping outer corners, long rear barrels.
 for(const side of [-1,1]){const eye=new T.Group();eye.position.x=side*.48;head.add(eye);const sh=new T.Shape();sh.moveTo(-.43,.41);sh.bezierCurveTo(-.12,.38,.32,.25,.45,.03);sh.bezierCurveTo(.59,-.22,.37,-.43,.10,-.43);sh.bezierCurveTo(-.19,-.43,-.42,-.15,-.43,.41);
  const shape=sh.getPoints(40);const mirror=new T.Shape(shape.map(p=>new T.Vector2(p.x*side,p.y)));const extrude=(depth,bevel)=>{const geo=new T.ExtrudeGeometry(mirror,{depth,bevelEnabled:true,bevelSize:bevel,bevelThickness:bevel,bevelSegments:3,curveSegments:24,steps:1});const pos=geo.attributes.position,norm=geo.attributes.normal,uv=geo.attributes.uv;for(let i=0;i<pos.count;i++){const x=pos.getX(i),y=pos.getY(i),z=pos.getZ(i);if(Math.abs(norm.getZ(i))>.8)uv.setXY(i,(x+.60)/1.20,(y+.5));else uv.setXY(i,Math.atan2(y,x)/(2*Math.PI)+.5,(z+bevel)/(depth+2*bevel));}uv.needsUpdate=true;return geo;};
  mesh(extrude(.69,.025),M.ochre,eye,[0,0,-.47]);mesh(extrude(.018,.013),M.ivory,eye,[0,0,.247]);
  const outline=shape.map(p=>new T.Vector3(p.x*side,p.y,.282));outline.push(outline[0].clone());mesh(new T.TubeGeometry(new T.CatmullRomCurve3(outline,true),96,.015,6,true),M.steel,eye);
  // Rear shell band and maintenance plate remain visible as the head turns.
  const band=mesh(extrude(.055,.016),M.steel,eye,[0,0,-.38]);
  const access=new T.Group();access.position.set(side*.409,-.025,-.14);access.rotation.y=side*Math.PI/2;eye.add(access);box(access,.22,.25,.025,M.ochre,[0,0,0],.055);for(const y of [-.08,.08])bolt(access,[0,y,.022],.017);
  const barrel=cyl(eye,.29,.55,M.dark,[side*.025,0,-.62]);cyl(eye,.30,.065,M.steel,[side*.025,0,-.81]);cyl(eye,.235,.025,M.ochre,[side*.025,0,-.91]);
  for(let i=0;i<5;i++)box(eye,.43,.023,.48,M.steel,[side*.025,.21+i*.012,-.62],.005);
  const optic=new T.Group();optic.position.set(-side*.045,.015,.283);eye.add(optic);cyl(optic,.286,.043,M.dark,[0,0,.008]);rim(optic,.27,.036,M.rust,.012);cyl(optic,.239,.038,M.chrome,[0,0,.026]);cyl(optic,.219,.025,M.rubber,[0,0,.053]);
  const lens=mesh(new T.SphereGeometry(.218,48,32),M.glass,optic,[0,0,.077]);lens.scale.z=.33;
  const center=mesh(new T.SphereGeometry(.105,32,20),new T.MeshPhysicalMaterial({color:0x08080c,metalness:.25,roughness:.055,clearcoat:1}),optic,[0,0,.144]);center.scale.z=.15;
  rim(optic,.155,.138,new T.MeshStandardMaterial({color:0x50404d,metalness:.8,roughness:.3}),.007);rim(optic,.22,.076,M.dark,.009);
  for(const [x,y] of [[-.33,.30],[.32,-.015],[.14,-.32]])bolt(eye,[side*x,y,.298],.024);
  tube(eye,[[side*.13,-.27,-.66],[side*.12,-.46,-.57],[side*.07,-.47,-.29],[0,-.24,-.14]],.029);eyes.push(eye);
 }
 const TRACK_HALF_WIDTH=TRACK_X;
 // Deep squat: the body bottom drops 0.77 (0.05 in the neck stage), ending just above the divider line.
 const SQUAT_DROP=.72,NECK_PART=.31;
 const WRIST_FLICK=.12;   // extra wrist bend (radians, about 7°) at the ends of each wave
 function animate({x,face,duck,wave,t,closeup,angle=0,vib={},dir=1,look=0}){
  const V={body:0,neck:0,arm:0,bob:0,rattle:0,...vib};
  // Facing the viewer is a pivot turn in place: yaw goes from +90° (travelling right) to 0°.
  // dir = +1 travels right, -1 travels left; facing the viewer is yaw 0 either way.
  const yaw=dir*Math.PI/2*(1-face);root.position.x=closeup?0:x;root.rotation.y=yaw+(closeup?angle:0);
  const n=Math.min(1,duck/NECK_PART),q=Math.max(0,(duck-NECK_PART)/(1-NECK_PART));
  suspension.position.y=-.05*n-SQUAT_DROP*q+V.bob*(1-.7*q)+V.rattle;suspension.rotation.x=-.03*n*(1-q)+V.body*(1-.7*q);
  // Neck folds toward the lowered target; the head counter-rotates to stay level, with a slight
  // upward glance at the sign while ducking and a curious tilt while facing the viewer.
  // look: +1 turns the neck to his right, -1 to his left (base swivel), with a slight head tilt.
  neck.rotation.y=-.62*look;
  const [a1,a2]=solveNeck(HEAD_REST.clone().lerp(HEAD_DUCK,n));lower.rotation.x=a1+.25*V.neck;upper.rotation.x=a2-.25*V.neck;
  head.rotation.x=-(a1+a2)-.075*face-.05*n+.6*V.neck;head.rotation.y=-.065*face;head.rotation.z=face*(.055+Math.sin(t*1.4)*.022);
  eyes.forEach((eye,i)=>eye.rotation.z=(i===0?1:-1)*(.035+.075*face+.5*V.neck));
  // Arms: the hands are held side by side in front of the chest ("innocent" pose of the reference
  // picture; the arms slide forward on their side rails and the piston forearms extend). To wave,
  // the right arm opens and lifts.
  const L=T.MathUtils.lerp;
  for(const {mount,shoulder,elbow,wrist,fingers,side} of arms){const w=side<0?wave:0,osc=Math.sin(t*6.2),k=-side;
   // Spring "give": the clasped hands share one spring so they move together; it fades out while waving.
   const sw=(V.armL??V.arm??0)*(1-w),hd=(V.handL??0)*(1-w);
   // In the deep squat the folded arms lift a little so the elbows clear the treads.
   shoulder.rotation.set(L(CLASP.sx+k*CLASP.dsx-.3*q,-2.55,w)+.5*sw,side*L(CLASP.sy,0,w),side*L(CLASP.sz,.40+.39*osc,w));
   // Wave: the wrist stays in line with the forearm through the middle of each side-to-side swing
   // and, as the arm reaches either end, flicks a few degrees further (WRIST_FLICK) in the same
   // direction. The flick is about the wrist's z axis, which faces the viewer, so the palm turns
   // in the plane of the screen and never tips toward or away from the viewer. (Measured on the
   // posed model: -osc turns the hand further in the direction the forearm is swinging.)
   const flick=-Math.sign(osc)*osc**4;
   elbow.rotation.x=L(CLASP.ex+k*CLASP.dex,-.38,w)+.5*hd+w*.33*Math.sin(t*6.2+1.4);
   wrist.rotation.set(L(CLASP.wx,0,w)+.6*hd,side*L(CLASP.wy,.06,w),side*L(CLASP.wz,0,w)+w*WRIST_FLICK*flick);
   mount.position.z=ARM_Z+L(CLASP.slide+k*CLASP.dslide,0,w);wrist.position.y=-.50-L(CLASP.ext,0,w);
   for(const f of fingers){const curl=L(.38,.12,w)+.9*hd;f.prox.rotation.x=f.dir*curl;f.dist.rotation.x=f.dir*curl*1.3;}}
  // Tank steering: while turning in place the two treads run in opposite directions by the arc
  // length each one travels (half-track width × yaw change), on top of the forward travel.
  for(const {shoe,phase,side} of links){const travel=dir*x-side*TRACK_HALF_WIDTH*(yaw-dir*Math.PI/2);
   const u=T.MathUtils.euclideanModulo(phase+travel/length,1),p=path.getPointAt(u),v=path.getTangentAt(u);shoe.position.set(0,p.y,p.x);shoe.rotation.x=Math.atan2(-v.y,v.x);}
  for(const {wheel,r,side} of wheels)wheel.rotation.x=(dir*x-side*TRACK_HALF_WIDTH*(yaw-dir*Math.PI/2))/r;
 }
 return{root,animate,parts:{root,suspension,body,arms,head,neck,lower,upper,tracks:root.children.filter(c=>c!==suspension)}};
}
