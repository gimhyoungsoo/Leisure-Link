<div align="center">
	
![header](https://capsule-render.vercel.app/api?type=waving&color=gradient&height=300&section=header&text=Leisure%20Link%+&fontSize=70&fontColor=FFFFFF&animation=fadeIn&stroke=000000)

</div>

# 목차
1. [**개요**](#개요)
2. [**개발내용**](#개발-및-개선-내용)
3. [**회고**](#회고)


# 개요

<div align="center">
	
<img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white"> <img src="https://img.shields.io/badge/css3-1572B6?style=for-the-badge&logo=css3&logoColor=white"> <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=white"> 

<img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=white"> <img src="https://img.shields.io/badge/React Router-CA4245?style=for-the-badge&logo=react router&logoColor=white"> <img src="https://img.shields.io/badge/recoil-3578E5?style=for-the-badge&logo=recoil&logoColor=white"> <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=Axios&logoColor=white">

<img src="https://img.shields.io/badge/Amazon AWS-232F3E?style=for-the-badge&logo=AmazonAWS&logoColor=white"> <img src="https://img.shields.io/badge/Amazon EC2-FF9900?style=for-the-badge&logo=AmazonEC2&logoColor=white"> <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=Firebase&logoColor=white"> 

<br/>
</div>

<br/>
<br/>

### 1. **레저링크+(플러스)** (개선된 작업물)

레저링크+(플러스) 는 팀 작업으로 진행했던 레저링크 프로젝트를 개선한 버전입니다.
![image](https://github.com/gimhyoungsoo/Leisure-Link/assets/85207564/9d356c0a-81f7-4856-896f-9e3b7fe3fdd3)


[**레저링크+(플러스) 배포 링크**: https://leisurelink-36f00.web.app/](https://leisurelink-36f00.web.app/)

**개발 기간**
23/09/26 ~ 23/10/03

**참여자**:
 [FE] **김형수**

> ### 2. 레저링크
>레저링크는 부트캠프에서 진행한 팀 프로젝트의 프로그램입니다.
>레저링크는 여행지에서 찍은 사진을 공유하고 싶다는 생각에서 시작된, 여행지의 사진을 공유하는 플랫폼 웹 사이트입니다.
> 
>[깃허브 저장소](https://github.com/codestates-seb/seb45_main_030)
> 
>[서비스 매뉴얼](https://docs.google.com/presentation/d/1kf5DykqZihYaiozTICohrnm0y2izw0VrStzX95gFwqw/edit?usp=sharing)
> 
>[기술 발표 영상](https://www.youtube.com/watch?v=CJrZyZfZDsw)
> 
> 개발 기간: 23/08/24 ~ 23/09/20
> 
>**참여자**: [FE] **김형수** 본인 포함 4명 , [BE] 3명,  총 7명

<br/>
<br/>



# 개발 및 개선 내용

### 개발 내용
레저링크 
개발 내용
- 메인페이지 컴포넌트
- 이미지 목록, 이미지 아이템 컴포넌트
- 추천, 북마크 컴포넌트
- 프론트엔드 팀원의 코드 통합 및 충돌 수정


## 🛠️ 주요 개선 내용

1. 모달 컴포넌트 전역상태 전달
    - 이슈 링크: [모든 모달 창이 중첩되는 오류 #4](https://github.com/gimhyoungsoo/Leisure-Link/issues/4)

2. 모달 창 컴포넌트 개선
    - 이슈 링크: [모달 창 추상화 적용 #3](https://github.com/gimhyoungsoo/Leisure-Link/issues/3)


3. 모달 창 레이아웃 이미지 반응형 개선
    - 이슈 링크: [모달창 레이아웃 반응형 개선 #7](https://github.com/gimhyoungsoo/Leisure-Link/issues/7)
      
3. 무한 스크롤 기능 개선

4. 추천/북마크 후 모달을 닫았을때 변경된 추천/좋아요 상태를 메인페이지 게시물에 반영하기

5. 추천과 북마크 데이터 요청 코드를 모듈화하기

6. 메인페이지 이미지 목록 렌더링 최적화

# 회고

## 팀 작업을 통해 깨달은 점

문제점
- 초반/중반: 작업, 후반: 통합 및 배포의 일정으로 단순하게 진행됐습니다.
- 후반에 통합하고 배포를 준비 할 때, 서버에서 데이터를 주고 받는 API에 개선사항이 있었지만 일정을 이유로 반영하지 않았습니다.
  
깨달은 점
- 코드 통합을 몰아서 진행하는 중에 충돌과 버그로 시간을 소모했습니다. 중반에 어느 정도 작성된 코드를 통합하는 과정을 거쳤다면 일정 후반의 압박이 줄었을 것이라 예상합니다.
- 애자일 방법론을 적용해 1주에 한번 진행상황을 검토하고 우선순위를 다시 세워 개발을 진행했다면 더 좋은 결과가 나왔을 것 같습니다.
 
## 코드 개선을 통해 깨달은 점

문제점
- 추상화, 모듈화 되지 않은 코드
- 잘못된 라이브러리 사용법

개선점
- 서식이 통일되지 않은 코드를 통합하면서, 협업을 할때 코딩 컨벤션을 지켜 일관성 있는 코드를 작성하는 것이 중요하다고 깨달았습니다. 
- 코드 개선 작업을 하면서, 코드를 모듈화할때 추상화의 원칙에 따라 단일 기능의 모듈로 구성해야 해당 모듈의 사용과 관련된 코드의 유지보수가 원활해지는 것을 알게되었습니다
- redux와 recoil이 혼재된 코드를 정리하면서 라이브러리를 신중하고 올바르게 사용하지 않으면 유지보수에 걸림돌이 된다는 것을 느꼈습니다.
  
느낀점
- AWS EC2로 구현된 서버의 API가 http 프로토콜로 이루어졌는데 개인적으로 배포하는 과정에서 github page, firebase, vercel등의 배포 플랫폼은 https로 하는 통신만 허용했기에 http로의 통신은 Mixed content 오류가 발생했습니다.
- AWS 인스턴스에 접근할수 없었던 상황이었기에 임시 방편으로 프록시 서버를 통해 http를 https로 변경해 통신에 성공하고 배포 하였습니다.
- 현재는 AWS 서버가 작동 중단 되어 서버에서 이미지를 불러 올 수 없습니다.


