ver3.0アップデート情報
1. グラデーション関数に、角度も入れられるようにしました。
@function lg($color01, $color02, $deg: 0) {
  @return linear-gradient($deg * 1deg, $color01 0%, $color02 100%);
}


2. メディアクエリに、min,maxを入れられるようになりました。
デフォルトは、min-widthです。（何も入れないときは、min）

@include mq(md, max) {
  display: none;
}
↓コンパイル後
@media screen and (max-width: 768px) {
  display: none;
}
---

3. メディアクエリに、数値を指定できるようになりました。

@include mq(1000) {
  font-size: 16px;
}
↓コンパイル後
@media screen and (min-width: 1000px) {
  font-size: 16px;
}