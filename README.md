<div align="center">
    <img src="https://raw.githubusercontent.com/9am/arc-ball/main/logo.svg" alt="arc-ball-logo" width="140" height="140" />
    <h1>&lt;arc-ball&gt;</h1>
	<p>A small Web Component enables arcball 3D view for everything inside.</p>
    <p>
        <a href="https://github.com/9am/arc-ball/blob/main/LICENSE">
            <img alt="GitHub" src="https://img.shields.io/github/license/9am/arc-ball?style=flat-square&color=success">
        </a>
        <a href="https://www.npmjs.com/package/@9am/arc-ball">
            <img alt="npm" src="https://img.shields.io/npm/v/@9am/arc-ball?style=flat-square&color=orange">
        </a>
        <a href="https://www.npmjs.com/package/@9am/arc-ball">
            <img alt="npm" src="https://img.shields.io/npm/dt/@9am/arc-ball?style=flat-square&color=blue">
        </a>
        <a href="https://bundlephobia.com/package/@9am/arc-ball@latest">
            <img alt="npm bundle size" src="https://img.shields.io/bundlephobia/minzip/@9am/arc-ball?style=flat-square">
        </a>
    </p>
</div>

Inspired by wonderful demos[^1] made by Bartosz Ciechanowski, and a great paper[^2] written by Ken Shoemake, this is a nice little tool for someone who like to create 3D models with CSS transform.

## Demo

Go to the [Home page](https://9am.github.io/arc-ball/).

<img width="32%" alt="arc-ball-demo-0" src="https://github.com/9am/arc-ball/assets/1435457/b7b86f36-229f-4a0b-a8a7-17d699b49e79" />
<img width="32%" alt="arc-ball-demo-2" src="https://github.com/9am/arc-ball/assets/1435457/f317ecd2-b6e0-43ff-8f74-8ab6e878b321" />
<img width="32%" alt="arc-ball-demo-1" src="https://github.com/9am/arc-ball/assets/1435457/66f0ed72-934e-40d0-8f7d-f67140cdfde8" />
<img width="32%" alt="arc-ball-demo-3" src="https://github.com/9am/arc-ball/assets/1435457/18164a91-254c-4a88-9f3d-e4d0101e15d2" />
<img width="32%" alt="arc-ball-demo-4" src="https://github.com/9am/arc-ball/assets/1435457/fe8eac0f-db47-4f2c-a46a-e55ad6146010" />

## Usage

Include via CDN(e.g. unpkg) or Download a copy

```html
<script src="https://unpkg.com/@9am/arc-ball/dist/index.min.js"></script>

<arc-ball>
    <section>preserve-3d CSS transform elements or anything you want</section>
</arc-ball>
```

```html
<arc-ball>
    <!-- built-in xyz axis indicator -->
    <arc-ball-axis></arc-ball-axis>
</arc-ball>
```

```html
<arc-ball>
    <!-- this'll not include by the arcball -->
    <section slot="escape">escape the 3d control</section>
</arc-ball>
```

```html
<arc-ball>
    <!-- built-in stl renderer -->
    <arc-ball-stl src="/* stl JSON */"></arc-ball-stl>
</arc-ball>
```

<details>
    <summary>Or import the ESM version</summary>

```html
<script type="module">
    import 'https://unpkg.com/@9am/arc-ball/dist/index.es.js';
</script>
```

</details>

<details>
    <summary>Or install via npm</summary>

```sh
npm install @9am/arc-ball
```

</details>

## Documentation

`width` `height` and `perspective` can be controlled by the style of the `<arc-ball>` element.

## License
[MIT](LICENSE)

[^1]: [Bartosz Ciechanowski Blog](https://ciechanow.ski/)
[^2]: [ARCBALL: A User Interface for Specifying Three-Dimensional Orientation Using a Mouse](https://graphicsinterface.org/wp-content/uploads/gi1992-18.pdf)
