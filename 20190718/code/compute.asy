//初始化画板
//filldraw(box((-3.5cm, -3.5cm), (3.5cm, 3.5cm)),fillpen = white);
Label[] params = new Label[]{"$a_{11}$", "$a_{12}$", "$a_{13}$", "$a_{21}$", "$a_{22}$", "$a_{23}$", "$a_{31}$", "$a_{32}$", "$a_{33}$"};
pair[] pos = new pair[] {
    (-1cm, 1cm),
    (0cm, 1cm),
    (1cm, 1cm),
    (-1cm, 0cm),
    (0cm, 0cm),
    (1cm, 0cm),
    (-1cm, -1cm),
    (0cm, -1cm),
    (1cm, -1cm)
};
int i = 0;
pen usecolor = rgb(72, 209, 204);
pen penWidth = linewidth(1.5);
pen fs = fontsize(15pt);
for (Label l: params) {
    label(l, pos[i], usecolor+penWidth+fs);
    ++i;
}

pair leftTop = (-1.5cm, 1.5cm);
pair leftBottom = (-1.5cm, -1.5cm);
draw(leftTop -- leftBottom, usecolor+penWidth);
pair rightTop = (1.5cm, 1.5cm);
pair rightBottom = (1.5cm, -1.5cm);
draw(rightTop -- rightBottom, usecolor+penWidth);
pair leftRow = (-2cm, 1cm);
pair rightRow = (2cm, 1cm);
draw(leftRow -- rightRow, p=dashed+usecolor+linewidth(1.5));
pair topColumn = (-1cm, 1.5cm);
pair bottomColumn = (-1cm, -1.5cm);
draw(topColumn -- bottomColumn, p=dashed+usecolor+linewidth(1.5));