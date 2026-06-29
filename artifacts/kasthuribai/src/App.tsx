import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import Home from "@/pages/Home";
import Collections from "@/pages/Collections";
import VideoShopping from "@/pages/VideoShopping";
import MyOrders from "@/pages/MyOrders";
import OrderTracking from "@/pages/OrderTracking";
import SilverCorner from "@/pages/SilverCorner";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "@/pages/not-found";
import { WelcomeAudio } from "@/components/WelcomeAudio";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/collections" component={Collections} />
      <Route path="/video-shopping" component={VideoShopping} />
      <Route path="/silver-corner" component={SilverCorner} />

      <Route path="/my-orders" component={MyOrders} />

      <Route path="/order-tracking/:orderId" component={OrderTracking} />
      <Route path="/admin" component={AdminDashboard} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <WelcomeAudio />
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
