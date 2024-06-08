using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace apz_pzpi_21_7_michkivskyi_yaroslav_task3.Services {
    internal class ApiService {
        private readonly HttpClient _httpClient;
        private string url="http://localhost:4000";

        public ApiService() {
            _httpClient = new HttpClient();
        }

        public async Task<bool> SendGpsData(object data, string fridgeId) {
            try {
                string json = JsonSerializer.Serialize(data);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var request = new HttpRequestMessage(new HttpMethod("PATCH"), $"{url}/fridge/{fridgeId}/relocate") {
                    Content = content
                };

                var response = await _httpClient.SendAsync(request);

                response.EnsureSuccessStatusCode();
                Console.WriteLine("GPS data sent succesfully");
                return true;
            }
            catch {
                Console.WriteLine("Error GPS data sending");
                return false;
            }
        }

        public async Task<string> SendTemperatureData(object data) {
            try {
                string json = JsonSerializer.Serialize(data);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync(url+"/tripcase/ti/add", content);
                response.EnsureSuccessStatusCode();
                return await response.Content.ReadAsStringAsync();
            }
            catch {
                Console.WriteLine("Error temperature data sending");
                return null;
            }
        }
    }
}