var gl;

function testGLError(functionLastCalled) {
    /* gl.getError returns the last error that occurred using WebGL for debugging */ 
    var lastError = gl.getError();

    if (lastError != gl.NO_ERROR) {
        alert(functionLastCalled + " failed (" + lastError + ")");
        return false;
    }
    return true;
}

function initialiseGL(canvas) {
    try {
        // Try to grab the standard context. If it fails, fallback to experimental
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");// webgl 이나 experimental-webgl을 사용하겠다.
        gl.viewport(0, 0, canvas.width, canvas.height);//파라미터 값 x start, y start, width, height
    }
    catch (e) {
    }

    if (!gl) {//만약 try에서 gl 이 initialize가 안되면 gl은 null일 것이므로 만약 gl이 실행이 안되었으면 이란 의미
        alert("Unable to initialise WebGL. Your browser may not support it");
        return false;
    }
    return true;
}

var shaderProgram;

function initialiseBuffer() {

    var vertexData = [
        -0.5, -0.6, -0.5, 1.0, 0.0, 0.0, 1.0, // 왼쪽,맨밑 앞 ,Front Face
         0.5, 0.6, -0.5, 1.0, 0.0, 0.0, 1.0, //오른쪽 맨위 앞,Front Face
         -0.5, 0.6, -0.5 , 1.0, 0.0 ,0.0, 1.0, //왼쪽 맨위 앞 Front Face
         -0.5, -0.6, -0.5, 1.0, 0.0, 0.0, 1.0, // 왼쪽,맨밑 앞 ,Front Face
         0.5, -0.6, -0.5, 1.0, 0.0, 0.0, 1.0, //오른쪽 맨밑 앞,Front Face
         0.5, 0.6, -0.5 , 1.0, 0.0 ,0.0, 1.0, //왼쪽 맨위 앞 Front Face

         -0.5, 0.6, 0.5 , 0.0, 0.0 ,1.0, 1.0, //왼쪽 맨위 앞 back Face
         0.5, 0.6, 0.5, 0.0, 0.0, 1.0, 1.0, //오른쪽 맨위 앞,back Face
         -0.5, -0.6, 0.5, 0.0, 0.0, 1.0, 1.0, // 왼쪽,맨밑 앞 ,back Face  
         0.5, 0.6, 0.5 , 0.0, 0.0 ,1.0, 1.0, //왼쪽 맨위 앞 back Face
         0.5, -0.6, 0.5, 0.0, 0.0, 1.0, 1.0, //오른쪽 맨밑 앞,back Face
         -0.5, -0.6, 0.5, 0.0, 0.0, 1.0, 1.0, // 왼쪽,맨밑 앞 ,back Face
        




/*
이러면 문제가 orientaion 이 반대가 된다. 따라서 다시 정의해줘야한다. 
역순으로 써주면 해결된다. 즉
1
2
3
으로 써줬던걸
3
2
1
방향으로 써주면 된다.
         -0.5, -0.6, -0.5, 1.0, 0.0, 0.0, 1.0, // 왼쪽,맨밑 뒤 ,Front Face
         0.5, 0.6, -0.5, 1.0, 0.0, 0.0, 1.0, //오른쪽 맨위 뒤,Front Face
         -0.5, 0.6, -0.5 , 1.0, 0.0 ,0.0, 1.0 //왼쪽 맨위 뒤 Front Face
         -0.5, -0.6, -0.5, 1.0, 0.0, 0.0, 1.0, // 왼쪽,맨밑  ,Front Face
         0.5, -0.6, -0.5, 1.0, 0.0, 0.0, 1.0, //오른쪽 맨밑 앞,Front Face
         0.5, 0.6, -0.5 , 1.0, 0.0 ,0.0, 1.0 //왼쪽 맨위 앞 Front Face
         */
    ];

    // Generate a buffer object
    gl.vertexBuffer = gl.createBuffer();//버퍼 생성
    // Bind buffer as a vertex buffer so we can fill it with data
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertexBuffer);//bindbuffer는 그 버퍼를 쓰겠다고 붙이는것
    /* Set the buffer's size, data and usage */
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);//static draw에서는 그냥 그리는것 dynamic draw는 다이나믹하게 드로우되는
    //여기다가 vertexData[0]=200 하면 좌표 안바뀜 cpu와 gpu를 구분하자
    return testGLError("initialiseBuffers");//에러나면 실행되는것
}

function initialiseShaders() {

    var fragmentShaderSource = '\
            varying highp vec4 color; \
			void main(void) \
			{ \
				gl_FragColor = color; \
			}';

// ' 부터 '까지 문자열 하나라고 생각
//rgba 값 0~255값으로 자동으로 바뀜 alpha는 투명도가 아니라 불투명도이다., 빨간색
    gl.fragShader = gl.createShader(gl.FRAGMENT_SHADER);//gl.FRAGMENT_SHADER의 값은 1
    gl.shaderSource(gl.fragShader, fragmentShaderSource);
    gl.compileShader(gl.fragShader);//c compile을 함
    // Check if compilation succeeded
    if (!gl.getShaderParameter(gl.fragShader, gl.COMPILE_STATUS)) {
        alert("Failed to compile the fragment shader.\n" + gl.getShaderInfoLog(gl.fragShader));
        return false;
    }

    // Vertex shader code
    var vertexShaderSource = '\
            attribute highp vec4 myVertex; \
            attribute highp vec4 myColor;  \
            uniform mediump mat4 transformationMatrix; \
            varying highp vec4 color; \
			void main(void)  \
			{ \
                gl_Position = transformationMatrix * myVertex; \
                color=myColor; \
			}';
            //나는 벡터를 3개 줬는데 얘는 4개 준거라고 함
            //gl_position은 화면에서의 좌표
            //varying은 vertex마다 색깔을넘겨줄때 사용  
    gl.vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(gl.vertexShader, vertexShaderSource);  
    gl.compileShader(gl.vertexShader);
    // Check if compilation succeeded
    if (!gl.getShaderParameter(gl.vertexShader, gl.COMPILE_STATUS)) {
        alert("Failed to compile the vertex shader.\n" + gl.getShaderInfoLog(gl.vertexShader));
        return false;
    }

    // Create the shader program
    gl.programObject = gl.createProgram();
    // Attach the fragment and vertex shaders to it
    gl.attachShader(gl.programObject, gl.fragShader);
    gl.attachShader(gl.programObject, gl.vertexShader);
    // Bind the custom vertex attribute "myVertex" to location 0
    gl.bindAttribLocation(gl.programObject, 0, "myVertex");
    // Link the program
    gl.linkProgram(gl.programObject);
    // Check if linking succeeded in a similar way we checked for compilation errors
    if (!gl.getProgramParameter(gl.programObject, gl.LINK_STATUS)) {
        alert("Failed to link the program.\n" + gl.getProgramInfoLog(gl.programObject));
        return false;
    }

    gl.useProgram(gl.programObject);

    return testGLError("initialiseShaders");
}
var rot_z=0.0;
function renderScene() {
    
    gl.clearColor(0.2, 0.2, 0.2, 1.0);//지우는 색깔을 이 색깔로 지워라
    gl.clear(gl.COLOR_BUFFER_BIT); //배경색깔을 지워라

    var matrixLocation = gl.getUniformLocation(gl.programObject, "transformationMatrix");

    var transformationMatrix = [
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    ];
    //transpose 한거라고 생각하면 됨
    rot_z+=0.01;
    transformationMatrix[0]=Math.cos(rot_z);
    transformationMatrix[5]=Math.cos(rot_z);
    transformationMatrix[1]=Math.sin(rot_z);
    transformationMatrix[4]=-Math.sin(rot_z);
    gl.uniformMatrix4fv(matrixLocation, gl.FALSE, transformationMatrix);

    if (!testGLError("gl.uniformMatrix4fv")) {
        return false;
    }

    // Enable the user-defined vertex array
    gl.enableVertexAttribArray(0);//첫번쨰 특성 x,y,z의 vertex의 위치
    
    // Set the vertex data to this attribute index, with the number of floats in each position
    gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 28, 0);//첫번째 어트리뷰트는 component(x,y,z의 꼭짓점 위치) 가 3개 이고 하나하나가 float(32bit)로 되어있음 28은 바이트
                                                           //그다음 vertex로 넘어가려면 28바이트 넘어가야하고 첫번째 attribut는 0번째에 있음
    gl.enableVertexAttribArray(1);//두번째 특성을 활성화 시킴
    gl.vertexAttribPointer(1,4,gl.FLOAT,gl.FALSE,28,12)//두번째 특성은 갯수가 4개임 x,y,z,opacity 그다음 vertex attribute로 넘어가려면 몇바이트를 점프해야해?가 5번째 파라미터 28임 왜냐하면 float니까 4byte 그리고 x,y,z,r,g,b,a 이렇게7개니까 28 그리고 마지막은 rgba의 시작포인트를 알려주는것 x,y,z 4*3 12 
    if (!testGLError("gl.vertexAttribPointer")) {
        return false;
    }

    gl.drawArrays(gl.TRIANGLES, 0, 12);//ps로하면 fill 이랑 같은의미 0은 startpoint(몇번째 vertex부터 그리냐) 우리는 삼각형을 4개 그려야하니까 12로 바꿔줌 즉 마지막이
    if (!testGLError("gl.drawArrays")) {//그니까 만약 뒷면만 그리고 싶으면 0대신 6넣으면 됨 그니까 버텍스 갯수
                                        //vertex의 갯수임 만약에 11이면 마지막 삼각형을 안그림
        return false;
    }

    return true;
}

function main() {
    var canvas = document.getElementById("helloapicanvas");

    if (!initialiseGL(canvas)) {
        return;
    }

    if (!initialiseBuffer()) {
        return;
    }

    if (!initialiseShaders()) {
        return;
    }

    // Render loop
    requestAnimFrame = (function () {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
			function (callback) {
			    window.setTimeout(callback, 1000, 60);
			};
    })();

    (function renderLoop() {
        if (renderScene()) {
            // Everything was successful, request that we redraw our scene again in the future
            requestAnimFrame(renderLoop);
        }
    })();
}
//vertex Attribute
//1.x,y,z 좌표



/*

수업시간에 관련된내용
1. 박스의 중심이 0,0
2. 세로축이 0.5, 가록축이 0.6 z축은 내눈에 가까운게 -0.5 먼게 0.5
따라서 맨오른쪽위 -0.5,0.6,-0.5

*/