using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;

namespace PruebaABR.Controllers
{
    public class AdministracionController : Controller
    {
        static string PruebaABRAPI = System.Configuration.ConfigurationManager.AppSettings["PruebaABRAPI"];
        #region Profesor
        public ActionResult Profesor()
        {
            return View();
        }

        public ActionResult ConsultaProfesores()
        {
            var objectoEnvio = new {
                Profesores = true
            };
            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.Add("cache-control", "no-cache");
                client.DefaultRequestHeaders.Add("JSON", "postValues");
                var jsonEnvio = JsonConvert.SerializeObject(objectoEnvio);
                using (HttpResponseMessage response = client.PostAsync($"{PruebaABRAPI}Consultas/ConsultaPersonas", new StringContent(jsonEnvio, Encoding.UTF8, "application/json")).Result)
                {
                    var Respuesta = response.Content.ReadAsStringAsync().Result;
                    return Json(Respuesta);
                }
            }
        }

        public ActionResult GuardarProfesor(ClasePersona data)
        {
            data.Profesor = true;
            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.Add("cache-control", "no-cache");
                client.DefaultRequestHeaders.Add("JSON", "postValues");
                var jsonEnvio = JsonConvert.SerializeObject(data);
                using (HttpResponseMessage response = client.PostAsync($"{PruebaABRAPI}Administracion/Persona_CRUD", new StringContent(jsonEnvio, Encoding.UTF8, "application/json")).Result)
                {
                    var Respuesta = response.Content.ReadAsStringAsync().Result;
                    return Json(Respuesta);
                }
            }
        }
        #endregion

        #region Alumno
        public ActionResult Alumno()
        {
            return View();
        }

        public ActionResult ConsultaAlumnos()
        {
            var objectoEnvio = new
            {
                Profesores = false
            };
            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.Add("cache-control", "no-cache");
                client.DefaultRequestHeaders.Add("JSON", "postValues");
                var jsonEnvio = JsonConvert.SerializeObject(objectoEnvio);
                using (HttpResponseMessage response = client.PostAsync($"{PruebaABRAPI}Consultas/ConsultaPersonas", new StringContent(jsonEnvio, Encoding.UTF8, "application/json")).Result)
                {
                    var Respuesta = response.Content.ReadAsStringAsync().Result;
                    return Json(Respuesta);
                }
            }
        }

        public ActionResult GuardarAlumno(ClasePersona data)
        {
            data.Profesor = false;
            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.Add("cache-control", "no-cache");
                client.DefaultRequestHeaders.Add("JSON", "postValues");
                var jsonEnvio = JsonConvert.SerializeObject(data);
                using (HttpResponseMessage response = client.PostAsync($"{PruebaABRAPI}Administracion/Persona_CRUD", new StringContent(jsonEnvio, Encoding.UTF8, "application/json")).Result)
                {
                    var Respuesta = response.Content.ReadAsStringAsync().Result;
                    return Json(Respuesta);
                }
            }
        }

        public ActionResult EliminarAlumno(ClaseEliminarAlumno data)
        {
            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.Add("cache-control", "no-cache");
                client.DefaultRequestHeaders.Add("JSON", "postValues");
                var jsonEnvio = JsonConvert.SerializeObject(data);
                using (HttpResponseMessage response = client.PostAsync($"{PruebaABRAPI}Administracion/EliminarAlumno", new StringContent(jsonEnvio, Encoding.UTF8, "application/json")).Result)
                {
                    var Respuesta = response.Content.ReadAsStringAsync().Result;
                    return Json(Respuesta);
                }
            }
        }
        #endregion

        #region Asignatura
        public ActionResult Asignatura()
        {
            return View();
        }

        public ActionResult ConsultaAsignaturas()
        {
            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.Add("cache-control", "no-cache");
                client.DefaultRequestHeaders.Add("JSON", "postValues");
                using (HttpResponseMessage response = client.PostAsync($"{PruebaABRAPI}Consultas/ConsultaAsignaturas", new StringContent(String.Empty, Encoding.UTF8, "application/json")).Result)
                {
                    var Respuesta = response.Content.ReadAsStringAsync().Result;
                    return Json(Respuesta);
                }
            }
        }

        public ActionResult GuardarAsignatura(ClaseAsignatura data)
        {
            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.Add("cache-control", "no-cache");
                client.DefaultRequestHeaders.Add("JSON", "postValues");
                var jsonEnvio = JsonConvert.SerializeObject(data);
                using (HttpResponseMessage response = client.PostAsync($"{PruebaABRAPI}Administracion/Asignatura_CRUD", new StringContent(jsonEnvio, Encoding.UTF8, "application/json")).Result)
                {
                    var Respuesta = response.Content.ReadAsStringAsync().Result;
                    return Json(Respuesta);
                }
            }
        }
        #endregion

        #region Asignar Asignatura
        public ActionResult AsignarAsignaturas()
        {
            return View();
        }

        public ActionResult GuardarNotas(ClaseAsignatura data)
        {
            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.Add("cache-control", "no-cache");
                client.DefaultRequestHeaders.Add("JSON", "postValues");
                var jsonEnvio = JsonConvert.SerializeObject(data);
                using (HttpResponseMessage response = client.PostAsync($"{PruebaABRAPI}Administracion/GuardarNotas", new StringContent(jsonEnvio, Encoding.UTF8, "application/json")).Result)
                {
                    var Respuesta = response.Content.ReadAsStringAsync().Result;
                    return Json(Respuesta);
                }
            }
        }
        #endregion
    }
}
public class ClasePersona
{
    public int? PersonaID { get; set; }
    public string Nombre { get; set; }
    public string Apellido { get; set; }
    public string Identificacion { get; set; }
    public string Telefono { get; set; }
    public string Direccion { get; set; }
    public int? Edad { get; set; }
    public bool? Activo { get; set; }
    public bool Profesor { get; set; }
}

public class ClaseEliminarAlumno
{
    public int PersonaID { get; set; }
}

public class ClaseAsignatura
{
    public int? AsignaturaID { get; set; }
    public string Codigo { get; set; }
    public string Nombre { get; set; }
    public int? PersonaID { get; set; }
    public string Persona { get; set; }
    public bool? Activo { get; set; }
}