设置窗口为flex布局
display:flex;
display:-webkit-flex;
容器的属性
flex-direction--主轴的方向---row(默认) | row-reverse | column | column-reverse
flex-wrap--如何换行---nowrap(默认) | wrap | wrap-reverse
flex-flow--flex-direction属性和flex-wrap属性的简写形式---flex-flow: <flex-direction> || <flex-wrap>;
justify-content--项目在主轴上的对齐方式--- flex-start | flex-end | center | space-between | space-around
align-items--项目在交叉轴上的对齐方式---flex-start | flex-end | center | baseline | stretch
align-content--多根轴线的对齐方式---flex-start | flex-end | center | space-between | space-around | stretch
项目的属性
order--定义项目的排列顺序--order: <integer>;
flex-grow--定义项目的放大比例---flex-grow: <number>; /* default 0 */
flex-shrink--定义了项目的缩小比例---flex-shrink: <number>; /* default 1 */
flex-basis--在分配多余空间之前，项目占据的主轴空间---flex-basis: <length> | auto; /* default auto */
flex--flex-grow, flex-shrink 和 flex-basis的简写，默认值为0 1 auto。后两个属性可选。
align-self--允许单个项目有与其他项目不一样的对齐方式，可覆盖align-items属性---auto | flex-start | flex-end | center | baseline | stretch