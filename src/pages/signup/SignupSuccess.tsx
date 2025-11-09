"use client"

import Link from "react-router-dom"
import { Button } from "../../components/ui"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, FileText, TrendingUp, Shield } from "lucide-react"

export function SignUpSuccessPage() {
  return (
    <div className="auth-background min-h-screen flex items-center justify-center px-4 py-8">
      <Card className="auth-card w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-6">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center shadow-lg ring-8 ring-white">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-4xl font-bold">Welcome to ASC e-Invoice</CardTitle>
          <CardDescription className="text-lg mt-3">Your account is ready to use</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-white rounded-lg">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">Submit Invoices</p>
                  <p className="text-xs text-muted-foreground mt-1">Create and submit invoices easily</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-white rounded-lg">
                  <Shield className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">FIRS Compliance</p>
                  <p className="text-xs text-muted-foreground mt-1">Track validation status</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-white rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">View Trends</p>
                  <p className="text-xs text-muted-foreground mt-1">Monitor submission trends</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-5">
            <p className="text-sm text-foreground">
              You&apos;re all set! Your FIRS Compliance Dashboard is ready. Start by creating your first organization
              and submit your invoices to ensure compliance.
            </p>
          </div>

          <div className="space-y-3">
            <Link href="/dashboard" className="block">
              <Button className="w-full bg-primary hover:bg-blue-700 text-white font-semibold py-5">
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/login" className="block">
              <Button
                variant="outline"
                className="w-full border-border text-primary hover:bg-blue-50 font-semibold bg-transparent"
              >
                Back to Login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
