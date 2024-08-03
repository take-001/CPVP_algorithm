# CPVP_algorithm
CPVP(critical points visiting probabilities)는 위치데이터 기반 경로 유사도 측정 알고리즘입니다.
<p align="center">
<img width="457" alt="image" src="https://github.com/user-attachments/assets/506c15d4-ecf6-4e33-87b0-4bbc334a4dcc">
<p\>


### Grid indexing
* Grid는 1차원 리스트로 저장된다.
* 1차원 리스트이 인덱스를 2차원 행렬로 변환하여, 실제 그리드가 2차원 상에서 어느 위치에 있을지를 반환한다.
* (i,j) 리턴.

```python
def n_to_coords(num,n=31):
    #사각형의 번호로 몇 행 몇 열에 있는지 반환
    i = num//n
    j = num%n

    return i,j
```

