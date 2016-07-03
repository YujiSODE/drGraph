/* drGraph_lineChart.js
*
*    Copyright (c) 2016 Yuji SODE <yuji.sode@gmail.com>
*
*    This software is released under the MIT License.
*    See LICENSE.txt or http://opensource.org/licenses/mit-license.php
*/
//the interface for simple graph with frequency of given data on Firefox: line chart.
function drLineChart(){
//============================================================================
  var slf=this.window,W,r9=slf.Math.random().toFixed(9).replace(/\./g,'');
  //=== element generator ===
  var f=function(elName,elId,targetId){
    var t=slf.document.getElementById(targetId),E=slf.document.createElement(elName);
    E.id=elId;
    return t.appendChild(E);
  };
  //=== it saves Canvas data as png. ===
  var saveCvs=function(cId){
    var c=slf.document.getElementById(cId),d,l,a,b,u;
    if(!slf.URL){
      d=c.toDataURL('image/png');
      d=d.replace('image/png','image/octet-stream');
      slf.location.href=d;
    }else{
      d=atob(c.toDataURL().split(',')[1]),l=d.length;
      a=new Uint8Array(l);
      for(var i=0;i<l;i+=1){a[i]=d.charCodeAt(i);}
      b=new Blob([a],{type:'image/octet-stream'});
      u=slf.URL.createObjectURL(b),slf.location.href=u,slf.URL.revokeObjectURL(u);}
  };
  //=== it draws a graph on a given canvas. ===
var drGraph=function(V,color,Id){
  //Id: canvas id, V: 'xRange@yRange#xMax@xMin,yMax@yMin#x@y,...,x@y'.
  var dW,dH,X,v,ar=[],c=slf.document.getElementById(Id).getContext('2d'),
      v0=V.split('#'),
      /*v1=[xRange,yRange];*/
      v1=v0[0].split('@'),
      /*v2=[xMax@xMin,yMax@yMin];*/
      v2=v0[1].split(','),
      /*v3=[x@y,...,x@y]*/
      v3=v0[2].split(',');
  dW=c.canvas.width/+v1[0],dH=c.canvas.height/+v1[1],X=v2[0].split('@');
  for(var i=0;i<v3.length;i+=1){ar.push(v3[i].split('@'));}
  ar.sort(function(e0,e1){return e0[0]-e1[0];});
  c.beginPath(),c.lineWidth=1.0,c.strokeStyle=color,c.globalAlpha=1.0;
  c.translate(X[1]<0?-X[1]*dW:0,0),c.moveTo(ar[0][0]*dW,c.canvas.height-ar[0][1]*dH);
  for(var i=1;i<ar.length;i+=1){
    c.lineTo(ar[i][0]*dW,c.canvas.height-ar[i][1]*dH);}
  c.translate(X[1]<0?X[1]*dW:0,0),c.stroke();
};
//============================================================================
/*id*/
  var divId='div_'+r9,cvsId='cvsId_'+r9,infId='infId_'+r9,fmId='fm_'+r9,iptId='ipt'+r9,BId='B_'+r9,
      /*=== <tag generation> ===*/
      tgtDiv,cvs,fm,infP,ipt=[],ctrF,ctrLb,ctrl=[],
      /*=== <worker generation> ===*/
      spt,b,U,
      /*=== <events> ===*/
      v,p=[],r,
      bd=slf.document.getElementsByTagName('body')[0];
  bd.id='bd_'+r9;
  //=== <tag generation> ===
  tgtDiv=f('div',divId,bd.id),bd.removeAttribute('id');
  cvs=f('canvas',cvsId,tgtDiv.id),cvs.width=100,cvs.height=100;
  infP=f('p',infId,tgtDiv.id),infP.innerHTML='Data input id:'+0+iptId;
  fm=f('form',fmId,tgtDiv.id);
  for(var i=0;i<5;i+=1){
    ipt[i]=f('input',i+iptId,fm.id),
      ipt[i].type=['text','color','button','button','button'][i],
      ipt[i].value=['1,2,2,3,3,3,4,4,5,6,7,7','#ff0000','Run','Clear canvas','Close'][i];}
  ctrF=f('form','ctr_'+fmId,tgtDiv.id);
  ctrLb=f('label','label'+ctrF.id,ctrF.id),ctrLb.innerHTML='<br>Target canvas id:';
  ctrl[0]=f('input','ipt'+ctrF.id,ctrLb.id);
  for(var i=1;i<3;i+=1){ctrl[i]=f('input',i+'B'+ctrF.id,ctrF.id);}
  for(var i=0;i<3;i+=1){
    ctrl[i].type=['text','button','button'][i],ctrl[i].value=[cvsId,'Reset target id','Output canvas as png'][i];}
  //=== </tag generation> ===
  //=== <worker generation> ===
  //script for worker.
  spt=[
    /*this method returns [max_value,min_value] of an array.*/
    'this.Array.prototype.maxMin=function(){var v,n=this.length,A=JSON.parse(JSON.stringify(this));v=A.sort(function(a,b){return b-a;});return [v[0],v[n-1]];};',
    /*this function returns parameters for drawing graph.A=[x0, ..., xn];returned value:'xRange@yRange#xMax@xMin,yMax@yMin#x@y,...,x@y'*/
    'var f=function(A){var i=0,O={},n=A.length,x=[],y=[],xy=[],rg=[],R=[];while(i<n){if(!O[A[i]]){O[A[i]]=1;}else{O[A[i]]+=1;}i+=1;}for(var e in O){x.push(+e),y.push(O[e]);}for(var i=0;i<2;i+=1){xy[i]=[x,y][i].maxMin(),rg[i]=xy[i][0]-xy[i][1]+1;}for(var i=0;i<x.length;i+=1){R.push(x[i]+\'@\'+y[i]);}i=O=null;return rg.join(\'@\')+\'#\'+xy[0].join(\'@\')+\',\'+xy[1].join(\'@\')+\'#\'+R.join();};',
    'this.addEventListener(\'message\',function(e){var d=e.data.split(\',\');this.postMessage(f(d));d=null;},true);'
    ].join('');
  //generation of worker
    b=new Blob([spt],{type:'text/javascript'});
    U=slf.URL.createObjectURL(b);
    W=new Worker(U),slf.URL.revokeObjectURL(U),b=null;
  //=== </worker generation> ===
  //=== <events> ===
  //eventlisteners with worker
  W.addEventListener('message',function(e){
    //p[0]: data, p[1]: color, p[2]: canvas id.
    p[0]=e.data;
    p[1]=slf.document.getElementById(ipt[1].id).value;
    p[2]=slf.document.getElementById(ctrl[0].id).value;
    if(!slf.document.getElementById(p[2])){slf.alert('Invalid canvas id.'); return;}
    drGraph(p[0],p[1],p[2]);
  },true);
  W.addEventListener('error',function(e){console.log(e.message),W.terminate();},true);
  //draw histogram.
  ipt[2].addEventListener('click',function(){v=slf.document.getElementById(ipt[0].id).value,W.postMessage(v);},true);
  //clear canvas.
  ipt[3].addEventListener('click',function(){
    v=slf.document.getElementById(cvsId).getContext('2d'),
      v.clearRect(0,0,v.canvas.width,v.canvas.height);
  },true);
  //close div tag.
  ipt[4].addEventListener('click',function(){
    r=tgtDiv.parentNode.removeChild(tgtDiv),W.terminate(),r=W=null;
  },true);
  //reset target id.
  ctrl[1].addEventListener('click',function(){ctrl[0].value=cvsId;},true);
  //output canvas data as png.
  ctrl[2].addEventListener('click',function(){saveCvs(cvsId);},true);
  //=== </events> ===
//============================================================================
}
