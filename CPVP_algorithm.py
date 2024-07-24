import os
import csv
import numpy as np
import sys
import datetime
import dateutil.parser
from datetime import datetime
import math
import random

def n_to_coords(num,n=31):
    #사각형의 번호로 몇 행 몇 열에 있는지 반환
    i = num//n
    j = num%n

    return i,j

def generation_square(squarecenter,n=31):
    #센터를 중심으로 가로,세로 1.5km의 정사각형을 n개의 정사각형으로 분할.
    l1=squarecenter[0]-0.007831555125996204*4 #약0.75km
    ln1=squarecenter[1]-0.009677410125732422*4#약0.75km
    l2=squarecenter[0]+0.007831555125996204*4 
    ln2=squarecenter[1]+0.009677410125732422*4
    square=[[l1,ln1],[l1,ln2],[l2,ln1],[l2,ln2]]
    set_of_unitsqaure=[]
    
    step_of_l=float((l2-l1)/n)
    step_of_ln=float((ln2-ln1)/n)
    for i in range(n):
        for j in range(n):
            temp=[[l1+i*step_of_l,ln1+j*step_of_ln],[l1+i*step_of_l,ln1+(j+1)*step_of_ln],[l1+(i+1)*step_of_l,ln1+(j+1)*step_of_ln],[l1+(i+1)*step_of_l,ln1+j*step_of_ln]]
            set_of_unitsqaure.append(temp)
    return set_of_unitsqaure

def fit_point_to_square(point,sofsquare):
    #점이 해당하는 사각형의 인덱스 반환
    for i in range(len(sofsquare)):
        if point[0] >= sofsquare[i][0][0] and point[0] <= sofsquare[i][2][0] and  point[1] >= sofsquare[i][0][1] and point[1] <= sofsquare[i][2][1]:
            return i


def generate_heatmap_by_point(point,sofsquare):
    dummy=[[0 for i in range(int(len(sofsquare)**(1/2)))]for j in range(int(len(sofsquare)**(1/2)))]
    #dummy = [[0]*int(math.sqrt(len(sofsquare)))]*int(math.sqrt(len(sofsquare)))
    q=fit_point_to_square(point,sofsquare)
    if q:
        i_,j_=  n_to_coords(q,int(math.sqrt(len(sofsquare))))
        emptiness=True
        x=0
        while emptiness:
            for i in range(i_-x,i_+x+1):
                for j in range(j_-x,j_+x+1):
                    if i >=0 and i< len(dummy) and  j >=0 and j< len(dummy):
                        dummy[i][j]=max(dummy[i][j],100/(math.log(x+1)+0.5))
                        #dummy[i][j]+=100/((x+1)*(x+1))
            x+=1
        
            can=[]
            for i in dummy:
                for j in i:
                    if j == 0:
                        can.append(j)
            if len(can)==0:
                emptiness = False
    return dummy
                    
def square_t_polygon(list,polygon):
    pol_dum=[]
    for j in list:    
        temp=[]
        for i in j:
            temp.append(str(i[0])+" "+str(i[1]))
        temp.append(temp[0])
        temp=",".join(temp)
        temp=polygon+"(("+temp+"))"
        pol_dum.append(temp)

    return pol_dum

def agg_heatmap(squarecenter,P):
    a= generation_square(squarecenter)
    can=[[0 for i in range(int(len(a)**(1/2)))]for j in range(int(len(a)**(1/2)))]
    #can=np.zeros([int(math.sqrt(len(a))),int(math.sqrt(len(a)))])
    for p in P:
        t=generate_heatmap_by_point(p,a)
        if len(t)>0:
            can=[[can[i][j]+t[i][j] for j in range(int(len(a)**(1/2)))]for i in range(int(len(a)**(1/2)))]
    return can,a

def CPVP_value(critical_point,can,square):
    
    a = can
    b= square #a=heatmap score, b= map
    c=critical_point
    f,p=n_to_coords(fit_point_to_square(c,b))
    m=np.max(a)
    if m == 0:
        val=0
    if m!=0:
        val=a[f][p]/m
    return val


def CPVP_int_1(criticalpoint, P):
    a,b=agg_heatmap(criticalpoint, P)
    c= CPVP_value(criticalpoint,a,b)
    return c