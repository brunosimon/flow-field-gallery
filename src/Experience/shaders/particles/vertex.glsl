uniform sampler2D uFBOTexture;
uniform sampler2D uMaskTexture;
uniform float uSize;

attribute vec2 aFboUv;
attribute float aSize;
attribute vec2 aUv;

varying vec2 vUv;

void main()
{
    vec4 fboColor = texture2D(uFBOTexture, aFboUv);

    vec4 modelPosition = modelMatrix * vec4(fboColor.xyz, 1.0); // fboColor.xyz
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    float lifeSize = min((1.0 - fboColor.a) * 10.0, fboColor.a * 2.0);
    lifeSize = clamp(lifeSize, 0.0, 1.0);

    gl_PointSize = uSize * lifeSize * aSize;
    gl_PointSize *= (1.0 / - viewPosition.z);

    vUv = aUv;
}