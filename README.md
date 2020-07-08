# Final Project



**Objective : Make web content to teach; WebGL, Computer Graphics.** 

### 주제

#### How to make Transparent WebGL canvas on HTML

*  `Javascript CODE`

> Canvas를 투명하게 하기위해서는 clearcolor의 alpha 부분에 최소 1보다낮은값 완전히 투명하게 하려면 0.0 을 넣어줘야한다. clearColor가 하는 역할은 초기화하는 색을 지정하는 함수이다. 여기서 gl.clear는 gl.clearColor에서 설정된 색상으로 화면을 지우는 함수이다 .
>
> gl.clearColor에는 4개의 인자가 사용된다. 첫번째 부터 세번째에는 0~1의 실수 가 들어간다 첫번째부터 Red,Green,Blue 순이다. 마지막이 중요한데 마지막이 alpha 즉, 투명도를 나타낸다. 사실 투명도 보다는 불투명도라는 말이 더 어울린다. 1일때 투명하지 않고 0일때 투명해지기에 그렇다.프로젝트를 보면 canvas에 opcacity를 조절할 수 있는 버튼을 넣었는데 그이유는 alpha가 완전히 0.0을 준 경우에는 canvas와 body태그 와의 경계가 어디까지 인것인지 불명확해지 때문이다.
>
> ```javascript
> gl.clearColor(0.0, 0.0, 0.0, 0.1); 
> gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
> ```
>
> 또한  WebGL에서 `Blending`이란 흔히 투명한 오브젝트를 구현하는 기술이다. 투명은 하나의 단색 컬러 가지고 있는 것이 아니라 오브젝트 자체가 가지고 있는 컬러와 뒤에 있는 다른 오브젝트의 컬러를 여러 비율로 혼합하는 것을 말한다. 현재 필자가 그리고 있는 큐브의 alpha값도 아래 코드와 같이 `0.5`로 바꾸어주었다 .
>
> ```javascript
> var vertexData = [
> // Backface (RED/WHITE) -> z = 0.5
> -0.5, -0.5, -0.5, 1.0, 0.0, 0.0, 0.5,
> 0.5, 0.5, -0.5, 1.0, 0.0, 0.0, 0.5,
> 0.5, -0.5, -0.5, 1.0, 0.0, 0.0, 0.5,
> -0.5, -0.5, -0.5, 1.0, 0.0, 0.0, 0.5,
> -0.5, 0.5, -0.5, 1.0, 0.0, 0.0, 0.5,
> 0.5, 0.5, -0.5, 1.0, 1.0, 1.0, 0.5,
> //......
> //The code does not end here but continues to progress......
> ```
>
> 이 큐브의 한 조각은 자기 본연의 컬러를 가지고 있지만 최종 컬러는 자신의 뒤에있는 큐브의 색과 섞여 우리에게 보여진다. alpha 값이 `0.5`라면 이는 오브젝트의 컬러가 본연의 컬러 50%, 뒤에 있는 오브젝트의 컬러 50%로 이루어진다는 의미이다.
>
> ```javascript
> gl.enable(gl.BLEND);
> ```
>
> 위의 코드를 사용하여 context에게 BLEND를 사용할 것이라고 알려주었다.
>
> 블렌딩은 색상버퍼에 이미 기록된 값 D와 새로 기록되는 값 S와의 연산을 정의한다.연산방법은 다음 두 함수로 정의된다. sfactor와 dfactor는 S색상과 D색상에 각각 적용할 연산식을 정의하며, mode는 두 연산결과를 합칠 방법을 정의한다.  사용한 모드에 따른 연산식은 아래와 같다, 디폴트는 GL_FUNC_ADD이다 
>
> 또한 blendFucn은 앞의 parameter가 source이며, 뒤에있는 요소가 destination이다. source는 첫번째 인자가 들어오는 화소고 두번째 인자인 destination이 목적지인 그려질 위치에 있던 화소를 말한다. 아래처럼 첫번째 인자가 gl.SRC_ALPHA이고 두번째 인자가  gl.ONE_MINUS_SRC_ALPHA이면 입력으로 들어오는 화소의 알파값이 입력화소의 블렌딩 비율이 된다. 1에서 입력으로 들어오는 화소의 알파값을 뺀 나머지 값이 원래 버퍼에 들어있던 화소의 블렌딩 비율이 된다는 말이다.
>
> ```javascript
> gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
> gl.blendEquation(gl.FUNC_ADD);
> ```
>
> > SF, DF는 sourcefactor, destinationfactor를 의미한다.
>
> | MODE                     | Value                  |
> | :----------------------- | :--------------------- |
> | GL_FUNC_SUBTRACT         | SF*SF - DF*DF          |
> | GL_FUNC_REVERSE_SUBTRACT | DF*DF - SF*SF          |
> | GL_MIN                   | SF*SF, DF*DF중 작은 값 |
> | GL_MAX                   | SF*SF, DF*DF중 큰 값   |
> | GL_FUNC_ADD              | SF*SF + DF*DF          |
>
> 





* `CSS CODE`

>```css
>#helloapicanvas {
>margin-top: 50px;
>z-index: 1;
>position: absolute;
>top: 20px;
>border: 5px solid blue;
>}
>```
>
>`canvas`를 단지 투명하게 만든다고 하여도 그 안에 그림을 넣는 다던가 글자를 써서 큐브가 돌아가는동안 글자의 큐브의 색과 혼합(Blend)하여 다른효과를 준다던지등의 효과를 주기 위해선 Canvas와 다른 요소들을 겹치게 하여야한다. 위의 코드는 그 역할을 해주는 코드로서 `helloapicanvas`는 `canvas`의 `id` 값에 해당한다. 여기서 `z-index`는 어느 객체가 앞에나올지 뒤에 나올지 배치순서를 결정하는 속성이다. 참고로 `z-index` 는 `position`(relative,absolute,fixed)속성이 적용된 요소에서만 작동한다. `absolute` 는 문서의 원래 위치와 상관없이 위치상 부모요소를 기준으로 작동한다. 여기서 위치한 부모 즉,postion을 지정해준 값이 없으므로 window객체를 기준으로 작동할것이다. 또한 absolute를 사용하였기 때문에 겹치는것이 허용된다. 이상태에서 z-index로 1을 써준것은 겹치더라도 해당하는 숫자가 클 수록 위로 올라오고, 숫자가 작을 수록 아래로 내려간다. Transparent 이기때문에 겹쳐도 확인할 수는 있지만 더 의도한 결과를 얻기 위하여 위같은 코드를 사용하였다.
>
>```css
>pre .final {
>margin-left: 310px;
>margin-top: 320px;
>font-size: 20px;
>opacity: 0.8;
>}
>```
>
>위 표기 방식은 pre태그 안에 .final 클래스를 가진 요소를 선택해서 css로 꾸며주는 방식이다. Canvas 큐브내에 들어가는 글자에 투명도를 주어 큐브가 돌아갈때마다 색깔이 변하므로 색깔을 변하게 하는 효과를 입혔다.





* `HTML CODE`

>  ```markdown
>  <div class="speed"><b> speed</b>
>     <br>
>     <button class="speedup" onclick="speedUp()">🔼</button>
>     <button class="speeddown" onclick="speedDown()">🔽</button>
>  </div>
>  ```
>
>  위의 코드는 버튼을 누르면 y축으로의 회전 속도 증가와 감소를 위하여 구성한 `HTML` 코드이다. `Javascript` 의 speedUp 과 speedDown함수로  연결된다.
>
>  ```javascript
>  var a = 0.01;
>  
>  function speedUp() {
>  a += 0.01;
>  }
>  
>  function speedDown() {
>  if (a > 0) {
>     a -= 0.01;
>  } else {
>     a = 0
>  }
>  
>  ------------------------------------------------------------------------------------------------------
>  mat4.fromYRotation(mMat, rotY);
>  if (flag_animation) {
>     rotY += a;
>  }
>  ```
>
>  위의 코드는 HTML에서 리스너가 알려주면 작동하는 함수이다. a라는 새로운 변수를 선언해주어 speedUp()함수가 호출되면 0.01씩 증가시켜주어 회전속도를 더 빠르게 하였다. 아랫방향 버튼을 누르면 속도를 줄일 수 있도록 a의 값에서 -0.01을 해주었다.
>
>  아래의 코드는 캔버스의 투명도를 조정해줄 수 있는 html 코드이다. 
>
>  ```html
>   <div class="opacity">
>          <b> opacity</b>
>          <br />
>          <button class="Bright" onclick="dark()">
>              &#x2B06;</button>
>          <button class="Dark" onclick="bright()">
>              &#x2B07;</button>
>      </div>
>  ```
>
>  ```javascript
>  function dark() {
>      canvaslight += 0.1;
>  }
>  
>  function bright() {
>      if (canvaslight > 0) {
>          canvaslight -= 0.1;
>      } else
>          canvaslight = 0.0;
>  }
>  
>  ------------------------------------------------------------------------------------------------------------
>   gl.clearColor(0.0, 0.0, 0.0, canvaslight);
>  ```
>
>  canvaslight 라는 변수를 alpha값으로 주어 투명도를 조정할 수 있게 하였다. 위방향버튼을 누르면 점점 어두워 지고 아래방향을 누르면 점점 더 밝아지는 것을 알 수 있다.

>  ```html
>  <pre>                 <div class="first">
>                          Founded in 2000, it is a non-profit industry
>                          whose main purpose is to enable the accelerated playback 
>                          and production of dynamic media on various platforms and 
>                          devices through the production of standard APIs and 
>                          open source without royalty restrictions.
>                        </div>
>  </pre>
>  ```
>
>  또한 pre 태그를 이용하면 html에 있는 모습과 그대로 출력할 수 있기 때문에 이 태그를 이용하였다.

### result

![final](https://user-images.githubusercontent.com/55227984/85912691-6abbf080-b869-11ea-882c-7d86cdd44943.gif)

아래는 해당 페이지의 독자들을 위한 설명이다.

![final](https://user-images.githubusercontent.com/55227984/85917723-8fc75800-b897-11ea-9f71-bf4bd70dd195.png)

![finall](https://user-images.githubusercontent.com/55227984/85917760-f0569500-b897-11ea-99bf-f26e62b09ed5.png)

### Cite

[1] https://www.w3schools.com/

[2]https://git.ajou.ac.kr/hwan/cg_course/-/tree/master/WebGL/texture

[3]https://developer.mozilla.org/en-US/docs/Web
