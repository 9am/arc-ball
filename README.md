<div align="center">
    <img src="https://raw.githubusercontent.com/9am/arc-ball/main/logo.svg" alt="arc-ball-logo" width="140" height="140" />
    <h1>&lt;arc-ball&gt;</h1>
	<p>A small Web Component enables arcball 3D view for its children.</p>
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

Inspired by wonderful demos made by [Bartosz Ciechanowski](https://ciechanow.ski/), this is a nice little tool for someone who like to create 3D models with CSS transform.

## Demo

Go to the [Home page](https://9am.github.io/arc-ball/).

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
    <!-- built-in xyz axis indicator-->
    <arc-ball-axis></arc-ball-axis>
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
