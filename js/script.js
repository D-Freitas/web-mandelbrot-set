const canvas = document.getElementById('main-canvas')
const gl = canvas.getContext('webgl')
const shaderProgram = gl.createProgram()
canvas.width = window.innerWidth
canvas.height = window.innerHeight

async function fetchShaderSource(path) {
    const response = await fetch(path)
    return response.text()
}

async function initShaderProgram() {
    const vertexShaderPath = 'shaders/vertex_shader.glsl'
    const fragmentShaderPath = 'shaders/fragment_shader.glsl'

    const [vertexShaderSource, fragmentShaderSource] = await Promise.all([
        fetchShaderSource(vertexShaderPath),
        fetchShaderSource(fragmentShaderPath)
    ])

    function createShader(gl, sourceCode, type) {
        const shader = gl.createShader(type)
        gl.shaderSource(shader, sourceCode)
        gl.compileShader(shader)

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(
                `An error occurred compiling the shaders: ${gl.getShaderInfoLog(
                    shader
                )}`
            )
            gl.deleteShader(shader)
            return null
        }

        return shader
    }

    const vertexShader = createShader(gl, vertexShaderSource, gl.VERTEX_SHADER)
    const fragmentShader = createShader(
        gl,
        fragmentShaderSource,
        gl.FRAGMENT_SHADER
    )

    gl.attachShader(shaderProgram, vertexShader)
    gl.attachShader(shaderProgram, fragmentShader)
    gl.linkProgram(shaderProgram)

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.log(`Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram)}`)
    }

    gl.useProgram(shaderProgram)

    const positionAttributeLocation = gl.getAttribLocation(shaderProgram, 'position')
    const resolutionUniformLocation = gl.getUniformLocation(shaderProgram, 'resolution')
    const viewPortUniformLocation = gl.getUniformLocation(shaderProgram, 'viewPort')
    const maxIterationsUniformLocation = gl.getUniformLocation(shaderProgram, 'maxIterations')

    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    const vertices = new Float32Array([
        -1.0, -1.0, 1.0, -1.0,
        -1.0, 1.0, 1.0, 1.0,
    ])
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height)
    gl.uniform1f(maxIterationsUniformLocation, 1000)

    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.uniform2f(viewPortUniformLocation, -2.0, -2.0)

    gl.enableVertexAttribArray(positionAttributeLocation)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0)

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
}

initShaderProgram()
