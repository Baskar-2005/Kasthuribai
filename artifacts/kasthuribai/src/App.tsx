import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import Home from "@/pages/Home";
import Collections from "@/pages/Collections";
import VideoShopping from "@/pages/VideoShopping";
import MyOrders from "@/pages/MyOrders";
import SilverCorner from "@/pages/SilverCorner";
import AdminDashboard from "@/pages/AdminDashboard";
import ScanOrder from "@/pages/ScanOrder";
import TrackOrder from "@/pages/TrackOrder";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/collections" component={Collections} />
      <Route path="/video-shopping" component={VideoShopping} />
      <Route path="/silver-corner" component={SilverCorner} />

      <Route path="/my-orders" component={MyOrders} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/scan/:orderId" component={ScanOrder} />
      <Route path="/track-order" component={TrackOrder} />

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
            {/* <WelcomeAudio /> — audio disabled */}
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
