<template>
  <div class="card">
      <Chart v-if="processedChartData" type="line" :data="processedChartData" :options="options" class="h-[30rem]" />
  </div>
</template>

<script>
import { Line } from "vue-chartjs";
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement
} from "chart.js";

// Register chart.js components
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

export default {
  extends: Line,
  props: {
      label: {
          type: String,
          default: "Telemetry Data"
      },
      chartData: {
          type: Array,
          required: true
      },
      options: {
          type: Object,
          required: true
      },
      chartColors: {
          type: Array,
          default: () => [
              { borderColor: "#ff6384", backgroundColor: "rgba(255,99,132,0.2)" },
              { borderColor: "#36a2eb", backgroundColor: "rgba(54,162,235,0.2)" },
              { borderColor: "#ffce56", backgroundColor: "rgba(255,206,86,0.2)" },
              { borderColor: "#4bc0c0", backgroundColor: "rgba(75,192,192,0.2)" },
              { borderColor: "#9966ff", backgroundColor: "rgba(153,102,255,0.2)" }
          ]
      }
  },
  computed: {
      processedChartData() {
          if (!this.chartData || this.chartData.length === 0) return null;

              const labels = this.chartData[0].data.map(d => d.xValue);
              const datasets = this.chartData.map((dataset, index) => {
              const colorIndex = index % this.chartColors.length;

             console.log('dataset.label',dataset.label);

              return {
                  label: dataset.label || `Dataset ${index + 1}`,
                  data: dataset.data.map(d => d.yValue),
                  borderColor: this.chartColors[colorIndex]?.borderColor || this.generateRandomColor(),
                  backgroundColor: this.chartColors[colorIndex]?.backgroundColor || this.generateRandomColor(0.2),
                  pointBorderColor: this.chartColors[colorIndex]?.borderColor || this.generateRandomColor(),
                  pointBackgroundColor: this.chartColors[colorIndex]?.borderColor || this.generateRandomColor(),
                  fill: false,
                  tension: 0.4
              };
          });

          return { labels, datasets };
      }
  },
  watch: {
      chartData: {
          deep: true,
          handler() {
              this.$data._chart?.destroy(); // Destroy old chart instance before re-rendering
              this.renderChart(this.processedChartData, this.options);
          }
      }
  },
  methods: {
      generateRandomColor(alpha = 1) {
          const r = Math.floor(Math.random() * 255);
          const g = Math.floor(Math.random() * 255);
          const b = Math.floor(Math.random() * 255);
          return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      }
  },
  mounted() {
      if (this.processedChartData) {
          this.renderChart(this.processedChartData, this.options);
      }
  }
};
</script>
