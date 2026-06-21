$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open("c:\Users\CandyGirl\Desktop\光线传奇\琳凯蒂亚语\琳凯蒂亚文化网站设计2026.06\consultation\现代琳凯蒂亚语 v26.5.docx")
$doc.Content.Text | Out-File -FilePath "c:\Users\CandyGirl\Desktop\光线传奇\琳凯蒂亚语\琳凯蒂亚文化网站设计2026.06\docx_content.txt" -Encoding UTF8
$doc.Close()
$word.Quit()
Write-Host "Done"