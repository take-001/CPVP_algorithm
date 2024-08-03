# CPVP_algorithm
**💡 summary**
<ul><li><code style="color : Gray">CPVP(critical points visiting probabilities)는 위치데이터 기반 경로 유사도 측정 알고리즘입니다.</code></li><li><code style="color : Gray">코드는 JavaScript와 Python으로 작성됐습니다.</code></li></ul>

<p align="center">
<img width="457" alt="image" src="https://github.com/user-attachments/assets/506c15d4-ecf6-4e33-87b0-4bbc334a4dcc">
<p\>
<br>   
<br>   

## Code
### 1. Grid indexing_1
* Grid는 1차원 리스트로 저장된다.
* 1차원 리스트이 인덱스를 2차원 행렬로 변환하여, 실제 그리드가 2차원 상에서 어느 위치에 있을지를 반환한다.

```python
def n_to_coords(num,n=31):
    #사각형의 번호로 몇 행 몇 열에 있는지 반환
    i = num//n
    j = num%n

    return i,j
```
---
### 2. Grid indexing_2
* 특정 좌표가 속해 있는 그리드 인덱스를 반환합니다.
* 인덱스는 1차원 값입니다. 이 1차원 값은 Grid indexing_2 함수에 의해 실제 2차원 인덱스로 변환됩니다.

```python
def fit_point_to_square(point,sofsquare):
    #점이 해당하는 사각형의 인덱스 반환
    for i in range(len(sofsquare)):
        if point[0] >= sofsquare[i][0][0] and point[0] <= sofsquare[i][2][0] and  point[1] >= sofsquare[i][0][1] and point[1] <= sofsquare[i][2][1]:
            return i
```
---
### 3. Grid generation
* Critical point를 중심으로 N X N 크기의 그리드를 생성합니다.
* 그리드 한 칸의 규격은 750X750 m^2 입니다.

```python
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
```

