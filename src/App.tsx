import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import AdminPage from './pages/AdminPage';
import AdminLogin from './pages/AdminLogin';
import AdminFuncionarioPage from './pages/AdminFuncionarioPage';
import AdminQuartoPage from './pages/AdminQuartoPage';
import OrdemLimpezaPage from './pages/OrdemLimpezaPage';
import EstadoPage from './pages/EstadoAdminPage';
import EstadiaPage from './pages/EstadiaAdminPage';

//tracy
import HospedePage from './pages/HospedePage';
import ReservaPage from './pages/ReservaPage';
import RelatorioReservasPage from './pages/RelatorioReservasPage';
import RelatorioFaturamentoPage from "./pages/RelatorioFaturamentoPage";
import TipoDeQuartoAdminPage from './pages/TipoDeQuartoAdminPage';
import HospedeAdminPage from './pages/HospedeAdminPage';
import ReservaAdminPage from "./pages/ReservaAdminPage";
import DashboardHome from "./pages/DashboardHome";

import EstadiaAdminPage from "./pages/EstadiaAdminPage";
import EstadoAdminPage from "./pages/EstadoAdminPage";
import QuartoAdminPage from "./pages/QuartoAdminPage";
import RelatorioLucroEstadiaPage from "./pages/RelatorioLucroEstadiaPage";
import RelatorioProcedenciaPage from "./pages/RelatorioProcedenciaPage";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/hospede" component={HospedePage} />
      <Route path="/reserva" component={ReservaPage} />
      <Route path="/admin/login" component={AdminLogin} />
      {/* <Route path="/estado" component={EstadoPage} /> */}
      {/* <Route path="/estadia" component={EstadiaPage} />  */}
      
      <Route path="/admin">
        <AdminPage><DashboardHome /></AdminPage>
      </Route>
      <Route path="/admin/ordem-limpeza">
        <AdminPage><OrdemLimpezaPage /></AdminPage>
      </Route>
      <Route path="/admin/funcionario">
        <AdminPage><AdminFuncionarioPage /></AdminPage>
      </Route>
      <Route path="/admin/quarto">
        <AdminPage><QuartoAdminPage /></AdminPage>
      </Route>
      <Route path="/admin/reservas">
        <AdminPage><ReservaAdminPage /></AdminPage>
      </Route>
      <Route path="/admin/hospedes">
        <AdminPage><HospedeAdminPage /></AdminPage>
      </Route>
      <Route path="/admin/tipos-de-quarto">
        <AdminPage><TipoDeQuartoAdminPage /></AdminPage>
      </Route>
      <Route path="/admin/relatorios/relatorio-reservas">
        <AdminPage><RelatorioReservasPage /></AdminPage>
      </Route>
      <Route path="/admin/relatorios/relatorio-faturamento">
        <AdminPage><RelatorioFaturamentoPage /></AdminPage>
      </Route>
      <Route path="/admin/estado">
        <AdminPage><EstadoAdminPage /></AdminPage>
      </Route>
      <Route path="/admin/Estadia">
        <AdminPage><EstadiaAdminPage /></AdminPage>
      </Route>
      <Route path="/admin/relatorios/relatorio-lucro-estadia">
        <AdminPage><RelatorioLucroEstadiaPage /></AdminPage>
      </Route>
      <Route path="/admin/relatorios/relatorio-procedencia">
        <AdminPage><RelatorioProcedenciaPage /></AdminPage>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;