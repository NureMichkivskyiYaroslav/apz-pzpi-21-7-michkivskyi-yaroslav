using System;

namespace apz_pzpi_21_7_michkivskyi_yaroslav_task3.Models {
    internal class GpsModule {
        private double Latitude {
            get; set;
        }
        private double Longitude {
            get; set;
        }

        public double[] GetLocation() {
            Latitude = new Random().NextDouble() * 180 - 90;
            Longitude = new Random().NextDouble() * 360 - 180;
            return new double[] { Latitude, Longitude };
        }
    }
}
