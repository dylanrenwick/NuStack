param ($testID)
dotnet C:\Users\$env:UserName\.nuget\packages\reportgenerator\5.0.0\tools\net6.0\ReportGenerator.dll "-reports:TestResults\$testID\coverage.cobertura.xml" "-targetdir:coveragereport\$testID" -reporttypes:Html
Invoke-Item ".\coveragereport\$testID\index.html"