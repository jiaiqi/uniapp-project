<template>
  <view><view id="bMap"></view></view>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    initMap() {  
      // GL版命名空间为BMapGL
      // 按住鼠标右键，修改倾斜角和角度
      var map = new BMapGL.Map('bMap'); // 创建Map实例
      map.centerAndZoom(new BMapGL.Point(108.737104,34.423692), 19); // 初始化地图,设置中心点坐标和地图级别
      map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
      // 创建小车图标
      	var pt = new BMapGL.Point(108.736327,34.424709);
      	var myIcon = new BMapGL.Icon("/static/logo.png", new BMapGL.Size(52, 50));
      	var marker = new BMapGL.Marker(pt, {
      		icon: myIcon
      	});  // 创建标注
      	map.addOverlay(marker); 
      map.setHeading(64.5);
      map.setTilt(73);
       var path = [
          {
              'lng': 108.735586,
              'lat': 34.423708
          }, {
          	'lng': 108.736134,
          	'lat': 34.423946
          }, {
          	'lng': 108.736534,
          	'lat': 34.423499
          }, {
          	'lng': 116.305732,
          	'lat': 40.054957
          }, {
          	'lng': 116.304754,
          	'lat': 40.057953
          }, {
          	'lng': 116.306487,
          	'lat': 40.058312
          }, {
          	'lng': 116.307223,
          	'lat': 40.056379
          }];
          var point = [];
          for (var i = 0; i < path.length; i++) {
              point.push(new BMapGL.Point(path[i].lng, path[i].lat));
          }
          var pl = new BMapGL.Polyline(point);
          setTimeout('start()', 3000);
          function start () {
              trackAni = new BMapGLLib.TrackAnimation(bmap, pl, {
                  overallView: true,
                  tilt: 30,
                  duration: 20000,
                  delay: 300
              });
              trackAni.start();
          }
    }
  },
  mounted() {
    this.initMap();
  }
};
</script>

<style lang="scss" scoped>
#bMap {
  width: 100vw;
  height: 100vh;
}
</style>
