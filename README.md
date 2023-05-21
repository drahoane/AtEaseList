# AtEaseList
_Drahoňovská Aneta_

## Cíl projektu
Cílem bylo vytvoření jednoduché sigle page aplikace pro správu aktivit uživatele. Jedná se tedy o tradiční koncept todo listu.

## Postup
Pro přidání nového todo je třeba vyplnit jeho název a případně jej doplnit o datum, které představuje deadline pro splnění daného úkolu. Samotné přidání se vykoná buď stiskem tlačítka Add, anebo stisknutím enteru, jestliže je kurzor aktuálně aktivní na inputu pro název či na inputu datumu. Po jedné z těchto akcí se uživateli todo uloží do jeho lokálního úložiště a vykreslí na obrazovku. Pro označení úkolu za splněný stačí kliknout na kulatý checkbox vedle názvu úkolu. Jestliže že si uživatel přeje opravit název/deadline todo nebo jej o datum obohatit, stačí vyplnit nové parametry do inputů nad samotným listem todos naprosto stejným způsobem jako při přidání nového úkolu, nicméně potvrzení pro akci o přepsání tentokrát stvrdí kliknutím na tlačítko + umístěné napravo od titulu úkolu. Kliknutím na tlačítko x dojde ke smazání daného úkolu. Skrze odkazy umístěné pod listem lze filtrovat mezi splněnými a aktivními úkoly. Tlačítkem Clear All Completed uživatel může jednoduše smazat všechny již splněné úkoly. V neposlední řadě může uživatel libovolně měnit pořadí existujících todos pouhým přetažením na požadované místo uvnitř listu.

## Popis funkčnosti
Jednotlivá todo se tvoří jakožto objekty třídy Todo a následně jsou společně umístěny v instanci třídy TodoList. Todos jsou lokálně uloženy u klienta pomocí local storage API. Atributy text, state a date blíže popisují jednotlivé úkoly a uživatel je může za chodu libovolně měnit. Input pro název todo je ošetřen pomocí pattern a voláním funkce escapeHTML k zabránění XSS útoku. K dispozici jsou také filtry na základě aktuální hodnoty atributu state (done/active), které využívá změn na hashi. Dále je implementované drag and drop API pro změnu pořadí todos v listu. Aplikace take disponuje audii při načtění a při mazání. Akce pro přidání nového todo či jeho smazání jsou taktéž doprovázeny o svg a css animace. CSS je doplněno o vendor prefixy především pro animace a flexbox.

