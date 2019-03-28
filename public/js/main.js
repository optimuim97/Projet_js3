var vers=parseFloat(navigator.appVersion);

if (vers<4.0) {alert("AVERTISSEMENT: Ce script requiert un navigateur de 4ieme g�n�ration.");}

var MXP=65535;
var MYP=65535;

var CMDS=new Array();
var ptcom=0;
var attente=0;
var nbptcom=0;
var pt=0;
var pt2=0;
var BUF=new Array();
var nom="";
var SobjX=new Array();
var SobjY=new Array();
var Nobj=new Array();
var Dobj=new Array();
var DDobj=new Array();
var PtObj=0;
var parti;
var leparam;


/* Permet de declencher le 006 apr�s l'ouverture */
function Parametre(param)
{
    parti=false
    if (param == 1)
    {
        parti=true;
    }
}

/* On cree l'objet */
function CreerObj(nom,px,py,tx,ty,visible,zindex,contenu,special,dragdrop)
{
    if (visible==1){visi="visible;"} else {visi="hidden;"};
    chaine='<div style="position:absolute;width:'+tx+'px;height:'+ty+'px;top:'+py+'px;left:'+px+'px;visibility:'+visi+'z-index:'+zindex+';" ID="'+nom+'" '+special+'>'+contenu+'</div>';
    document.write(chaine);
    Nobj[PtObj]=nom;
    SobjX[PtObj]=tx;
    SobjY[PtObj]=ty;
    Dobj[PtObj]=0;
    DDobj[PtObj]=dragdrop;
    PtObj+=1;
}
    
/*On cache l'objet */
function CacherObj(nom)
{
    document.all.item(nom).style.visibility = "hidden";
}

/* On montre l'objet */
function VoirObj(nom)
{
    document.all.item(nom).style.visibility = "visible";
}

/* On modifie un objet */
function ModifierObj(nom,contenu)
{
    document.all.item(nom).innerHTML=contenu;
}

/* On place l'objet */
function PlacerObj(nom,px,py)
    {
        if (px!=-10000) {document.all.item(nom).style.left = px;}
        if (py!=-10000) {document.all.item(nom).style.top = py;}
    }

function SourisX(){var value=MXP;return value;}
function SourisY(){var value=MYP;return value;}
function Mouvement()
{
    MXP = event.clientX+document.body.scrollLeft;
    MYP = event.clientY+document.body.scrollTop;
    return false;
}
document.onmousemove = Mouvement;

function TailleX(){var value=document.body.clientWidth;return value;}
function TailleY(){var value=document.body.clientHeight;return value;}
function OffsetX(){var value=document.body.scrollLeft;return value;}
function OffsetY(){var value=document.body.scrollTop;return value;}

function ObjX(nom)
{
    var chaine=document.all.item(nom).style.left;
    var value=parseInt(chaine.substring(0,chaine.length-2));
    return value;
}

function ObjY(nom)
{
    var chaine=document.all.item(nom).style.top;
    var value=parseInt(chaine.substring(0,chaine.length-2));
    return value;
}


function AddCom(donnees,delai)
{
    CMDS[nbptcom]=donnees;
    nbptcom+=1;
    CMDS[nbptcom]=delai;
    nbptcom+=1;
}

function MoveObj(nom,x1,y1,x2,y2,vit)
{
    BUF[pt2]=1;
    pt2+=1;
    BUF[pt2]=nom;
    pt2+=1;
    BUF[pt2]=x1;
    pt2+=1;
    BUF[pt2]=y1;
    pt2+=1;
    BUF[pt2]=x2;
    pt2+=1;
    BUF[pt2]=y2;
    pt2+=1;
    BUF[pt2]=vit;
    pt2+=1;
    BUF[pt2]=x1;
    pt2+=1;
    BUF[pt2]=y1;
    pt2+=1;
    BUF[pt2]=vit;
    pt2+=1;
    pt+=1;
}

function BounceObj(nom,x1,y1,y2,vit)
{
    /* Pt.... si 3 objets alors Pt prend successivement les valeurs 0,1 et 2 */
    /* Pt2... va permettre d'indicer le tableau */
    BUF[pt2]=2;
    pt2+=1;
    BUF[pt2]=nom;
    pt2+=1;
    BUF[pt2]=x1;
    pt2+=1;
    BUF[pt2]=y1;
    pt2+=1;
    BUF[pt2]=y2;
    pt2+=1;
    BUF[pt2]=vit;
    pt2+=1;
    BUF[pt2]=y1;
    pt2+=1;
    BUF[pt2]=0;
    pt2+=1;
    BUF[pt2]=1;
    pt2+=1;
    pt+=1;
}

function FallObj(nom,x1,y1,y2,vitx,vity)
{
    BUF[pt2]=8;
    pt2+=1;
    BUF[pt2]=nom;
    pt2+=1;
    BUF[pt2]=x1;
    pt2+=1;
    BUF[pt2]=y1;
    pt2+=1;
    BUF[pt2]=y2;
    pt2+=1;
    BUF[pt2]=vitx;
    pt2+=1;
    BUF[pt2]=vity;
    pt2+=1;
    BUF[pt2]=x1;
    pt2+=1;
    BUF[pt2]=y1;
    pt2+=1;
    BUF[pt2]=1;
    pt2+=1;
    pt+=1;
}



function animator(temps)
{
    //if (parti == true)
    //{
        if (pt!=0)
        {
            pt3=0;
            for ( j = 0 ; j < pt ; j++ )
            {
                com=BUF[pt3];
                pt3+=1;
                /* On bouge les objets */
                if (com==1)
                {
                    if (BUF[pt3+8])         /* BUF[9] Permet de savoir si le traitement est effectu� */
                    {
                        nom=BUF[pt3];       /* BUF[1] Nom de l'objet */
                        cx1=BUF[pt3+1];     /* BUF[2] Position de depart en X de l'objet */
                        cy1=BUF[pt3+2];     /* BUF[3] Position de depart en Y de l'objet */
                        cx2=BUF[pt3+3];     /* BUF[4] Position d'arriv�e en X de l'objet */
                        cy2=BUF[pt3+4];     /* BUF[5] Position d'arriv�e en Y de l'objet */
                        nbi=BUF[pt3+5];     /* BUF[6] Vitesse */
                        rx=BUF[pt3+6];      /* BUF[7] Position de depart de l'objet en X */
                        ry=BUF[pt3+7];      /* BUF[8] Position de depart de l'objet en Y */
                        dx=(cx2-cx1)/nbi;   /* Incrementaion en X */
                        dy=(cy2-cy1)/nbi;   /* Incrementaton en Y */
                        rx=rx+dx;
                        ry=ry+dy;
                        PlacerObj(nom,Math.round(rx),Math.round(ry));
                        BUF[pt3+6]=rx;
                        BUF[pt3+7]=ry;
                        BUF[pt3+8]-=1;      /* On met cette case � 0 */
                    }
                    pt3+=9;
                }
                /* REBONDISSEMENT */
                /* Au d�part pt2 est egal � 1 */
                if (com==2)
                {
                    if (BUF[pt3+7])     /* Si 8�me case = 1 alors ... */
                    {
                        /* PATIE FIXE DU TABLEAU */
                        nom=BUF[pt3];       /* BUF[1] NOM DE L'OBJET */
                        cx1=BUF[pt3+1];     /* BUF[2] Position de depart de l'objet en X */
                        cy1=BUF[pt3+2];     /* BUF[3] Position de depart de l'objet en Y */
                        cy2=BUF[pt3+3];     /* BUF[4] Position en Y � laquelle l'objet arrive */
                        nbi=BUF[pt3+4];     /* BUF[5] Vitesse */
                    
                        /* PARTIE VARIABLE DU TABLEAU */
                        ry=BUF[pt3+5];      /* BUF[6] Position de depart de l'objet en Y */
                        dy=BUF[pt3+6];      /* BUF[7] Incr�mentation */
                    
                        ry+=dy;
                        /* Cas o� le parcours a �t� effectu� */
                        if (ry>cy2)         /* Si pos depart > pos arrivee */
                        {
                            ry=cy2;                 /* Pos depart = Pos arriv�e */
                                                    /* Une fois arriv� en bas, on remonte */
                            dy=-(dy/1.75);          /* On diminue l'incrementation = trajet de haut en bas */
                            if ((dy>=-2) && (dy<=2))
                            {
                                BUF[pt3+7]=0;
                                nbi=0;
                            }
                        }
	                    /* Tant que l'on est pas arriv� � destination */
                        dy+=nbi;    /* Nbi est la vitesse */
                        PlacerObj(nom,Math.round(cx1),Math.round(ry));
                        /* Cela permet de faire une variation de vitesse */
                        BUF[pt3+6]=dy;  /* BUF[7] Nouvelle incr�mentation en Y */
                        BUF[pt3+5]=ry;  /* BUF[6] Nouvelle position de depart en Y de l'objet */
                    }
                    pt3+=8;
                }
                
                /* L'objet tombe */
                if (com==8)
                {
                    if (BUF[pt3+8])
                    {
                        nom=BUF[pt3];
                        cx1=BUF[pt3+1];
                        cy1=BUF[pt3+2];
                        cy2=BUF[pt3+3];
                        vitx=BUF[pt3+4];
                        vity=BUF[pt3+5];
                        dx=BUF[pt3+6];
                        dy=BUF[pt3+7];
                        dx+=vitx;
                        dy+=vity;
                        vity+=1;
                        if (dy>cy2)
                        {
                            dy=cy2;
                            BUF[pt3+8]=0;
                        }
	                    PlacerObj(nom,Math.round(dx),Math.round(dy));
                        //BUF[pt3+6]=dx;
                        BUF[pt3+6]=cx1;
                        BUF[pt3+7]=dy;
                        BUF[pt3+5]=vity;
                    }
                    pt3+=9;
                }  				
            }
        }
        if ((nbptcom!=0) && (ptcom<=nbptcom))
        {
            if (attente==0)
            {
                comm=CMDS[ptcom];
                ptcom+=1;
                if (comm=="LOOP;")
                {
                    ptcom=0;
                }
                else
                {
                    eval(comm);
                    attente=CMDS[ptcom];
                    ptcom+=1;
                }
            }
            else
            {
                attente-=1;
                if (attente<0) {attente=0;}
            }
        }
    //}
    setTimeout("animator("+temps+")",temps)
}