<div class="throbber"></div>

<style>
    .throbber {
        display: inline-block;
        perspective: 300px;
    }

    .throbber::after {
        content: "";
        animation: flip 0.8s ease-in-out infinite;
        background-color: #00000040;
        display: inline-block;
        height: 128pt;
        border-radius: 8pt;
        aspect-ratio: 3/4;
    }

    @keyframes flip {
        0% {
            transform: rotateX(0deg) rotateY(0deg);
        }
        50% {
            transform: rotateX(-180deg) rotateY(0deg);
        }
        100% {
            transform: rotateX(-180deg) rotateY(-180deg);
        }
    }
</style>
