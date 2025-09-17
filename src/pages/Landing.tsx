import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload, CheckCircle, Settings, Shield, Clock } from "lucide-react";

const Landing = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-12">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Secure Document Signing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload, sign, and manage your documents with Setu's secure API integration. 
            A professional solution for all your digital signing needs.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90">
            <Link to="/upload">Start Signing Documents</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/settings">Configure API Settings</Link>
          </Button>
        </div>
      </div>

      {/* How It Works */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-semibold mb-4">How It Works</h2>
          <p className="text-muted-foreground">Simple steps to get your documents signed securely</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="text-center shadow-professional hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mx-auto h-12 w-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <CardTitle>1. Configure API</CardTitle>
              <CardDescription>
                Set up your Setu API credentials in the settings page
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center shadow-professional hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mx-auto h-12 w-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                <Upload className="h-6 w-6 text-white" />
              </div>
              <CardTitle>2. Upload Document</CardTitle>
              <CardDescription>
                Upload your PDF contract and initiate the signing process
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center shadow-professional hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mx-auto h-12 w-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <CardTitle>3. Track & Download</CardTitle>
              <CardDescription>
                Monitor signing status and download completed documents
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="shadow-professional">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-primary" />
              <span>Secure Integration</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Direct integration with Setu's secure APIs for document upload, 
              signature requests, and status tracking.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-professional">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-primary" />
              <span>Real-time Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Track your document signing progress in real-time with automatic 
              status updates and notifications.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Security Notice */}
      <Card className="border-warning/20 bg-warning/5">
        <CardHeader>
          <CardTitle className="text-warning flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Security Notice</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This is a frontend-only demonstration application. API credentials are stored 
            in your browser's local storage for convenience but should never be used in 
            production environments. Always use secure backend services for credential management.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Landing;