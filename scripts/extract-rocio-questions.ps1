param([string]$Source, [string]$Destination)

Add-Type -AssemblyName System.IO.Compression.FileSystem
$archive = [IO.Compression.ZipFile]::OpenRead($Source)
$entry = $archive.GetEntry('word/document.xml')
$reader = [IO.StreamReader]::new($entry.Open())
$document = [xml]$reader.ReadToEnd()
$reader.Close()
$archive.Dispose()

$manager = [Xml.XmlNamespaceManager]::new($document.NameTable)
$manager.AddNamespace('w', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main')
$paragraphs = foreach ($paragraph in $document.SelectNodes('//w:p', $manager)) {
  $value = (($paragraph.SelectNodes('.//w:t', $manager) | ForEach-Object { $_.InnerText }) -join '').Trim()
  if ($value) { $value }
}

$questions = [Collections.Generic.List[object]]::new()
for ($index = 0; $index -lt $paragraphs.Count; $index++) {
  if ($paragraphs[$index] -notmatch '^(ROC-(G\d{2})-V(\d{2})-\d{2})\s+\u00B7\s+(.+?)\s+\u00B7\s+Dificultad:\s+(.+)$') { continue }
  $code = $Matches[1]
  $lesson = "$($Matches[2])_V$($Matches[3])"
  $type = $Matches[4]
  $difficulty = $Matches[5]
  $prompt = $paragraphs[++$index]
  $options = @()
  foreach ($letter in 'A','B','C','D') {
    $line = $paragraphs[++$index]
    $options += ($line -replace "^$letter\)\s*", '')
  }
  $answerLine = $paragraphs[++$index]
  if ($answerLine -notmatch '^Respuesta correcta:\s*([A-D])\.\s*(.*)$') { throw "Answer not recognized in $code" }
  $answerLetter = $Matches[1]
  $explanation = $Matches[2]
  $answer = [byte][char]$answerLetter - [byte][char]'A'
  $criterion = ($paragraphs[++$index] -replace '^Criterio:\s*', '')
  $recovery = ($paragraphs[++$index] -replace '^Recuperaci.n:\s*', '')
  $questions.Add([ordered]@{
    code = $code; lesson = $lesson; type = $type; difficulty = $difficulty
    prompt = $prompt; options = $options; answer = $answer
    explanation = $explanation; criterion = $criterion; recovery = $recovery
  })
}

if ($questions.Count -ne 632) { throw "Expected 632 questions; extracted $($questions.Count)." }
$json = $questions | ConvertTo-Json -Depth 5
[IO.File]::WriteAllText((Resolve-Path $Destination), $json, [Text.UTF8Encoding]::new($false))
Write-Output "Questions extracted: $($questions.Count)"
