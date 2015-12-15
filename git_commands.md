----
## Git commands


### Voor je begint:

Installeer GitHub:
[GitHub Desktop](https://desktop.github.com/)

**(Alleen voor Windows, ik weet niet of je iets vergelijkbaars voor OSX moet doen)**
Voeg Git toe aan de 'PATH' environment variabele, zodat git commands vanuit elke folder in cmd kunnen worden uitgevoerd:
[Adding Git to PATH](http://www.chambaud.com/2013/07/08/adding-git-to-path-when-using-github-for-windows/) 

Controleer door in de command line tool naar een willekeurige folder te gaan en `git` in te voeren en druk op enter. als de Git hulp tevoorschijn komt, is het gelukt. Als je een melding krijgt dat git niet herkent wordt, is git niet goed toegevoegd aan de 'PATH' variabele.

### Initialiseer
Ga naar een lege map waar je het project wil hebben.

`git init`

### Download repository

`git clone URL`

voorbeeld

`git clone https://github.com/JeroenLammen/S4DHangouts.git `

### Voeg remote repository toe

`git remote add REMOTENAME URL` 

de REMOTENAME is de naam die je aan de remote repository koppelt, die je later gebruikt bij push en pull commands. Deze naam mag je zelf verzinnen.

voorbeeld:

`git remote add origin https://github.com/JeroenLammen/S4DHangouts.git`

### Bekijk remote repositories

`git remote -v`

### Verwijder remote repository

`git remote rm REMOTENAME`

voorbeeld:

`git remote rm origin`

### Controleer wijzigingen

Bekijk je gewijzigde bestanden, en of deze klaar zijn om te committen ("staged for commit", groene kleur), of dat deze niet klaar zijn om te committen ("not staged", rode kleur).

`git status`

dit commando kan je het beste na bestandswijzigingen en na het 'git add' commando uitvoeren ter controle.

### Voeg bestanden toe om te committen
voorbeelden:

`git add client` voeg 'client' folder toe met alle daaronderliggende bestanden

`git add app.js` voeg 'app.js' toe

`git add *.js` voeg alle .js bestanden toe

`git add *` voeg alle bestanden toe

### Maak wijzigingen ongedaan

Als je wijzigingen hebt aangebracht in een of meerdere bestanden, en je wilt dit ongedaan maken, dan kan je het volgende doen:

##### Voor 'not staged files' (Niet klaar om te committen):
`git checkout FILENAME`

voorbeeld:

`git checkout server/app.js`

##### Voor 'staged files' (Klaar om te committen):

`git reset HEAD FILENAME`

voorbeeld:

`git reset HEAD server/app.js`

hiermee wordt het bestand "not staged", vervolgens voer je het eerder genoemde commando weer in:

`git checkout server/app.js`

### Commit

Als je klaar bent met (een groep) wijzigingen, commit deze wijzigingen dan:

`git commit -m "MESSAGE"`

voorbeeld

`git commit -m "loginpagina gemaakt"`

Je kunt meerdere commits maken voordat je deze pusht naar de remote repository. Zo kun je bijvoorbeeld eerst de loginpagina maken en de gewijzigde bestanden committen, om vervolgens de chatpagina te maken en daar een tweede commit van te maken. Zo blijven deze wijzigingen gegroepeerd.

### Push naar remote repository

Push alle commits naar de remote repository:

`git push REMOTENAME BRANCHNAME`

voorbeeld:

`git push origin master`

de branchname is standaard 'master'

### Pull

Als er wijzigingen zijn aangebracht in de remote repository, en jij hebt deze wijzigingen nog niet in je lokale project, dan doe je een pull request:

`git pull REMOTENAME BRANCHNAME`

voorbeeld:

`git pull origin master`

### Branches

**Let op!**
**Dit onderdeel is voor mij ook nieuw, dus informatie kan foutief zijn.**

Branches worden gebruikt om een aparte versie van je applicatie te maken waarin je wijzigingen kunt aanbrengen, zonder dat de 'master' branch aangepast wordt.

### Bekijk branches

Bekijk de branches in je project

`git branch`

de 'master' branch zit hier altijd in

### Nieuwe branch

`git branch BRANCHNAME`

voorbeeld:

`git branch bugfixes`

### Ga naar andere branch

`git checkout BRANCHNAME`

voorbeeld:

`git checkout bugfixes`

binnen deze branch kan je vervolgens wijzigingen aanbrengen en commits maken. Ook kan je deze branch pushen naar de remote repository:

`git push origin bugfixes`

In de remote repository op GitHub kan je vervolgens deze branch bekijken door in de dropdown list de branch te selecteren

### Branches mergen

Als je wijzigingen in een nieuwe branch wilt toepassen aan de 'master' branch, ga je eerst naar de master branch door:

`git checkout master`

en vervolgens:

`git merge BRANCHNAME`

waar BRANCHNAME de naam van de branch is die je wil mergen, bijvoorbeeld 'bugfixes'

Vervolgens kan je de wijzigingen, die je zojuist hebt toegepast in de master branch, natuurlijk weer pushen naar de master branch in de remote repository met:

`git push origin master`

### Branches verwijderen

Een branch kan je verwijderen doormiddel van:

`git branch -d BRANCHNAME`