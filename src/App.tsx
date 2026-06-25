import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import HospedePage from './pages/HospedePage';
import ReservaPage from './pages/ReservaPage';
import TipoDeQuartoPage from './pages/TipoDeQuartoPage';
import AdminPage from './pages/AdminPage';
import AdminLogin from './pages/AdminLogin';
import AdminFuncionarioPage from './pages/AdminFuncionarioPage';
import AdminQuartoPage from './pages/AdminQuartoPage';
import OrdemLimpezaPage from './pages/OrdemLimpezaPage';
import EstadoPage from './pages/EstadoPage';
//import EstadiaPage from './pages/EstadiaPage';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/hospede" component={HospedePage} />
      <Route path="/reserva" component={ReservaPage} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/estado" component={EstadoPage} />
      {/* <Route path="/estadia" component={EstadiaPage} />  */}
      
      <Route path="/admin">
        <AdminPage><h2>Bem-vindo ao Painel</h2></AdminPage>
      </Route>
      <Route path="/admin/ordem-limpeza">
        <AdminPage><OrdemLimpezaPage /></AdminPage>
      </Route>
      <Route path="/admin/funcionario">
        <AdminPage><AdminFuncionarioPage /></AdminPage>
      </Route>
      <Route path="/admin/quarto">
        <AdminPage><AdminQuartoPage /></AdminPage>
      </Route>
      <Route path="/admin/hospedes">
        <AdminPage><HospedePage /></AdminPage>
      </Route>
      <Route path="/admin/tipos-de-quarto">
        <AdminPage><TipoDeQuartoPage /></AdminPage>
      </Route>
      <Route path="/admin/estado">
        <AdminPage><EstadoPage /></AdminPage>
      </Route>
      {/* <Route path="/admin/Estadia">
        <AdminPage><EstadiaPage /></AdminPage>
      </Route> */}

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