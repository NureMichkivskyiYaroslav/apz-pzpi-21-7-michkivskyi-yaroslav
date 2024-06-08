using System;

namespace apz_pzpi_21_7_michkivskyi_yaroslav_task3.Models {
    internal class TemperatureIndicator {
        private string CaseId {
            get; set;
        }
        private double Temperature {
            get; set;
        }

        public TemperatureIndicator(string caseId) {
            CaseId = caseId;
        }

        public double GetTemperature() {
            Temperature = new Random().Next(-50, 50);
            return Temperature/10;
        }

        public string GetCaseId() {
            return CaseId;
        }
    }
}