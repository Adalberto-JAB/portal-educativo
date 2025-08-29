const HistoricalFactService = {
  getHistoricalFactsForDateRange: async (startMonth, startDay, numDays = 7) => {
    const facts = [];
    let currentDate = new Date(
      new Date().getFullYear(),
      startMonth - 1,
      startDay
    );

    for (let i = 0; i < numDays; i++) {
      const month = currentDate.getMonth() + 1;
      const day = currentDate.getDate();

      // Mock data for historical facts
      const mockFactsData = {
        // January
        1: {
          1: [
            "1804 - Haití declara su independencia de Francia.",
            "1892 - Nace J.R.R. Tolkien, autor de 'El Señor de los Anillos'.",
          ],
        },
        // August
        8: {
          28: [
            "1821 - Se proclama la independencia del Perú.",
            "1963 - Martin Luther King Jr. pronuncia su discurso 'I Have a Dream'.",
          ],
        },
        // September
        9: {
          1: [
            "1939 - Alemania invade Polonia, lo que marca el inicio de la Segunda Guerra Mundial.",
            "1807 - El ejército de Napoleón Bonaparte ocupa Copenhague, Dinamarca.",
            "1923 - Un terremoto masivo, conocido como el Gran Terremoto de Kantō, destruye Tokio y Yokohama en Japón.",
            "1985 - Una expedición de EE.UU. y Francia localiza los restos del RMS Titanic en el Atlántico Norte.",
            "1878 - El primer servicio de telefonía comercial del mundo se instala en New Haven, Connecticut.",
            "1969 - El coronel Muamar Gadafi derroca la monarquía en Libia en un golpe de estado incruento.",
          ],
          2: [
            "1666 - El Gran Incendio de Londres comienza y destruye gran parte de la ciudad en cuatro días.",
            "1945 - Japón firma el acta de rendición a bordo del USS Missouri, poniendo fin a la Segunda Guerra Mundial.",
            "1807 - La Marina Real británica bombardea la ciudad de Copenhague para apoderarse de la flota danesa.",
            "1969 - El Arpanet, precursor de Internet, se pone en marcha en EE.UU.",
            "1901 - El presidente de EE.UU. Theodore Roosevelt pronuncia su famoso discurso 'habla suavemente y lleva un gran garrote'.",
            "1945 - Ho Chi Minh proclama la República Democrática de Vietnam.",
          ],
          3: [
            "1783 - Se firma el Tratado de París, poniendo fin a la Guerra de Independencia de EE.UU.",
            "1939 - Reino Unido y Francia declaran la guerra a Alemania después de la invasión de Polonia.",
            "1189 - Ricardo I, conocido como Ricardo Corazón de León, es coronado rey de Inglaterra en la Abadía de Westminster.",
            "1943 - Italia se rinde a los Aliados durante la Segunda Guerra Mundial.",
            "1967 - El servicio de radiotelevisión sueco Sveriges Radio cambia de conducir por la izquierda a hacerlo por la derecha.",
            "1976 - La nave espacial Viking 2 de la NASA aterriza en la superficie de Marte.",
          ],
          4: [
            "1888 - George Eastman patenta la cámara Kodak y registra la marca.",
            "1998 - Larry Page y Sergey Brin fundan Google en Menlo Park, California.",
            "1972 - Mark Spitz gana su séptima medalla de oro en los Juegos Olímpicos de Múnich, un récord en ese momento.",
            "1781 - Los colonos españoles fundan el pueblo de Los Ángeles, California.",
            "1886 - El líder de los apaches Gerónimo se rinde a los exploradores estadounidenses.",
            "1957 - El Ford Edsel se presenta al público por primera vez.",
          ],
          5: [
            "1972 - La masacre de Múnich tiene lugar en los Juegos Olímpicos cuando terroristas palestinos matan a 11 atletas israelíes.",
            "1774 - El Primer Congreso Continental se reúne en Filadelfia, Pensilvania.",
            "1698 - Pedro el Grande, zar de Rusia, impone un impuesto sobre las barbas para forzar a los hombres a adoptar costumbres occidentales.",
            "1914 - Comienza la Primera Batalla del Marne durante la Primera Guerra Mundial.",
            "1905 - El Tratado de Portsmouth, mediado por Theodore Roosevelt, pone fin a la Guerra Ruso-Japonesa.",
            "1977 - La NASA lanza la sonda espacial Voyager 1 para estudiar los planetas exteriores.",
          ],
          6: [
            "1901 - El presidente de EE.UU. William McKinley es asesinado en Buffalo, Nueva York.",
            "1915 - El primer tanque militar se patenta en Gran Bretaña.",
            "1976 - Un desertor de la Fuerza Aérea soviética vuela un MiG-25 a Japón, permitiendo a EE.UU. examinar la tecnología soviética.",
            "1522 - El Victoria, el único barco restante de la expedición de Fernando de Magallanes, completa la primera circunnavegación del mundo.",
            "1861 - El presidente de EE.UU. Abraham Lincoln prohíbe el comercio con los estados confederados.",
            "1991 - El nombre de la ciudad de Leningrado se cambia a San Petersburgo.",
          ],
          7: [
            "1822 - Brasil se independiza de Portugal.",
            "1927 - El inventor estadounidense Philo Farnsworth demuestra la primera televisión completamente electrónica.",
            "1812 - La Batalla de Borodinó se libra entre las fuerzas de Napoleón y el ejército ruso cerca de Moscú.",
            "1533 - La reina de Inglaterra Isabel I nace en el Palacio de Placentia.",
            "1978 - El presidente de EE.UU. Jimmy Carter, el presidente de Egipto Anwar Sadat y el primer ministro de Israel Menachem Begin se reúnen en Camp David para discutir la paz en Oriente Medio.",
            "1940 - El Blitz, una serie de bombardeos alemanes contra el Reino Unido, comienza con ataques a Londres.",
          ],
          8: [
            "1565 - Se funda la ciudad de San Agustín, Florida, la colonia europea habitada de forma continua más antigua de Estados Unidos.",
            "1951 - El Tratado de San Francisco se firma, terminando formalmente la guerra con Japón.",
            "1900 - Un huracán devasta Galveston, Texas, matando a más de 6,000 personas.",
            "1966 - La serie de televisión 'Star Trek' se emite por primera vez en EE.UU.",
            "1943 - El gobierno de la Italia fascista firma un armisticio con los Aliados.",
            "1974 - El presidente de EE.UU. Gerald Ford indulta a su predecesor Richard Nixon por todos los crímenes relacionados con el escándalo de Watergate.",
          ],
          9: [
            "1976 - Mao Zedong, líder de la Revolución Comunista China, fallece.",
            "1850 - California es admitida en la Unión como el 31.º estado de EE.UU.",
            "1776 - El Congreso Continental de EE.UU. renombra a las 'Colonias Unidas' como los 'Estados Unidos de América'.",
            "1893 - El poeta y revolucionario chino Sun Yat-sen funda la primera sociedad antimonárquica en Hawái.",
            "1948 - Corea del Norte se establece formalmente con la proclamación de la República Popular Democrática de Corea.",
            "2001 - La nave espacial Cassini-Huygens, la más grande y compleja jamás lanzada, se prepara para su viaje a Saturno.",
          ],
          10: [
            "1960 - Abebe Bikila de Etiopía se convierte en el primer atleta africano en ganar una medalla de oro en los Juegos Olímpicos.",
            "1846 - Elias Howe recibe la patente para la máquina de coser.",
            "1939 - Canadá le declara la guerra a Alemania, uniéndose a la Segunda Guerra Mundial.",
            "1974 - Guinea-Bissau se independiza de Portugal.",
            "1919 - El Tratado de Saint-Germain-en-Laye es firmado, disolviendo el Imperio Austrohúngaro.",
            "1967 - El primer servicio de metro de Toronto se inaugura.",
          ],
          11: [
            "2001 - Los ataques terroristas del 11 de Septiembre destruyen las Torres Gemelas del World Trade Center en Nueva York.",
            "1973 - El golpe de Estado en Chile derroca al presidente Salvador Allende.",
            "1941 - La construcción del Pentágono comienza en Arlington, Virginia.",
            "1922 - El Mandato Británico de Palestina entra en vigor.",
            "1857 - La masacre de Mountain Meadows ocurre en Utah, donde un grupo de milicianos mormones atacan una caravana de emigrantes de Misuri y Arkansas.",
            "1916 - El primer avión de combate se utiliza en la Primera Guerra Mundial.",
          ],
          12: [
            "1953 - John F. Kennedy se casa con Jacqueline Lee Bouvier.",
            "1940 - Las cuevas de Lascaux, con sus pinturas prehistóricas, son descubiertas en Francia.",
            "1977 - El activista sudafricano antiapartheid Steve Biko fallece bajo custodia policial.",
            "1958 - El primer circuito integrado, o chip de silicio, es demostrado por Jack Kilby de Texas Instruments.",
            "1683 - El ejército polaco y los soldados de Austria, bajo el mando del rey Juan III Sobieski, derrotan a los turcos otomanos en la Batalla de Viena.",
            "1992 - Mae Jemison se convierte en la primera mujer afroamericana en viajar al espacio.",
          ],
          13: [
            "1993 - La Declaración de Principios de Oslo, el primer acuerdo entre Israel y la OLP, se firma en Washington, D.C.",
            "1759 - Las fuerzas británicas capturan Quebec en la Batalla de las Llanuras de Abraham.",
            "1971 - El líder chino Lin Biao fallece en un accidente de avión en Mongolia en un presunto intento de golpe de Estado.",
            "1948 - El primer partido de fútbol americano profesional se televisa en EE.UU.",
            "1848 - Phineas Gage sobrevive a un accidente que le atraviesa el cerebro con una barra de hierro, lo que proporciona información sobre el funcionamiento del cerebro.",
            "1985 - Nintendo lanza el videojuego 'Super Mario Bros.' en Japón.",
          ],
          14: [
            "1901 - Theodore Roosevelt asume la presidencia de EE.UU. después de que William McKinley falleciera.",
            "1812 - Napoleón Bonaparte entra en Moscú, solo para encontrar la ciudad en llamas.",
            "1959 - La sonda soviética Luna 2 se convierte en la primera nave espacial en llegar a la Luna.",
            "1829 - El Tratado de Adrianópolis pone fin a la Guerra Ruso-Turca.",
            "1741 - George Frideric Handel completa su oratorio 'El Mesías'.",
            "1982 - El príncipe Rainiero III de Mónaco contrae matrimonio con la actriz estadounidense Grace Kelly.",
          ],
          15: [
            "1821 - Centroamérica se independiza de España.",
            "1935 - Las Leyes de Núremberg son proclamadas en la Alemania nazi, institucionalizando la discriminación contra los judíos.",
            "1916 - El primer uso de tanques en combate tiene lugar en la Batalla del Somme durante la Primera Guerra Mundial.",
            "1959 - El líder soviético Nikita Khrushchev se convierte en el primer líder soviético en visitar Estados Unidos.",
            "1821 - Costa Rica, El Salvador, Guatemala, Honduras y Nicaragua declaran su independencia de España.",
            "2008 - El banco de inversión Lehman Brothers se declara en quiebra, lo que marca un punto álgido de la crisis financiera mundial.",
          ],
          16: [
            "1810 - México inicia su guerra de independencia con el Grito de Dolores.",
            "1620 - El barco Mayflower sale de Plymouth, Inglaterra, hacia América.",
            "1982 - La masacre de Sabra y Chatila comienza cuando una milicia cristiana libanesa masacra a refugiados palestinos en Beirut.",
            "1975 - Papúa Nueva Guinea se independiza de Australia.",
            "1908 - La General Motors Corporation se funda en Flint, Míchigan.",
            "1963 - Malasia se forma como una federación de Malaca, Singapur, Sabah y Sarawak.",
          ],
          17: [
            "1787 - La Constitución de Estados Unidos es firmada en Filadelfia.",
            "1939 - La Unión Soviética invade el este de Polonia.",
            "1944 - El Puente de Arnhem se captura en un intento fallido de los Aliados de poner fin a la guerra de forma rápida en la Operación Market Garden.",
            "1961 - El avión de transporte de las Naciones Unidas que llevaba a su secretario general, Dag Hammarskjöld, se estrella en Rhodesia del Norte.",
            "1862 - La Batalla de Antietam, la batalla más sangrienta en un solo día de la Guerra de Secesión estadounidense, tiene lugar en Maryland.",
            "1991 - El programa de televisión 'Los Simpson' se emite por primera vez en EE.UU.",
          ],
          18: [
            "1947 - Se crea la Fuerza Aérea de EE.UU. como un servicio militar independiente.",
            "1970 - El músico de rock Jimi Hendrix fallece en Londres.",
            "1759 - El explorador inglés James Cook desembarca en las costas de Australia.",
            "1931 - El Incidente de Mukden, un pretexto para la invasión japonesa de Manchuria, tiene lugar.",
            "1978 - El presidente de EE.UU. Jimmy Carter, el presidente de Egipto Anwar Sadat y el primer ministro de Israel Menachem Begin firman los Acuerdos de Camp David.",
            "1927 - El primer vuelo transatlántico en solitario se completa por Charles Lindbergh.",
          ],
          19: [
            "1985 - Un terremoto devastador golpea la Ciudad de México.",
            "1893 - Nueva Zelanda se convierte en el primer país del mundo en otorgar el voto a las mujeres.",
            "1957 - El primer ensayo de misiles nucleares soviéticos se lleva a cabo en Kazajistán.",
            "1881 - El presidente de EE.UU. James A. Garfield fallece por heridas de un disparo sufrido en julio.",
            "1995 - 'La Unión Europea' aprueba el uso de la moneda única, el euro.",
            "1982 - La estrella del pop Michael Jackson lanza el sencillo 'Thriller'.",
          ],
          20: [
            "1806 - Los exploradores estadounidenses Lewis y Clark regresan a San Luis, Misuri, después de su expedición.",
            "1946 - Se celebra el primer Festival de Cine de Cannes.",
            "1970 - El líder palestino Yasser Arafat es expulsado de Jordania después del Septiembre Negro.",
            "1920 - El primer partido de fútbol americano profesional se celebra en Akron, Ohio.",
            "1519 - El explorador Fernando de Magallanes comienza su viaje alrededor del mundo desde Sanlúcar de Barrameda, España.",
            "1984 - La Embajada de EE.UU. en Beirut, Líbano, es bombardeada por terroristas.",
          ],
          21: [
            "1981 - Belice se independiza del Reino Unido.",
            "1937 - J.R.R. Tolkien publica 'El Hobbit'.",
            "1991 - Armenia declara su independencia de la Unión Soviética.",
            "1792 - La Convención Nacional de Francia declara la abolición de la monarquía.",
            "1964 - Malta se independiza del Reino Unido.",
            "1971 - El rey de Bután, Jigme Singye Wangchuck, se casa con cuatro reinas en una ceremonia.",
          ],
          22: [
            "1862 - Abraham Lincoln emite la Proclamación de Emancipación preliminar.",
            "1980 - Irak invade Irán, comenzando la Guerra Irán-Irak.",
            "1792 - La Primera República Francesa se proclama formalmente.",
            "1955 - La primera emisión de televisión en color se transmite en EE.UU.",
            "1985 - Los acuerdos del 'Plaza Accord' se firman para depreciar el dólar estadounidense frente al yen japonés y al marco alemán.",
            "1994 - La serie de televisión 'Friends' se emite por primera vez en EE.UU.",
          ],
          23: [
            "1846 - El astrónomo alemán Johann Galle descubre el planeta Neptuno.",
            "1932 - El Reino de Arabia Saudita se funda tras la unificación del Hiyaz y Nejd.",
            "1780 - El traidor estadounidense Benedict Arnold es descubierto en West Point, Nueva York.",
            "1962 - El presidente de EE.UU. Richard Nixon realiza su famoso discurso 'Chequers' en Londres.",
            "1973 - El líder del IRA, el general Seán Mac Stíofáin, es capturado y encarcelado en Irlanda del Norte.",
            "1983 - La banda 'Pink Floyd' lanza su exitoso álbum 'The Wall'.",
          ],
          24: [
            "1957 - El presidente de EE.UU. Dwight D. Eisenhower envía tropas federales a Little Rock, Arkansas, para proteger a estudiantes afroamericanos que se matricularon en una escuela pública.",
            "1869 - El pánico financiero del 'Viernes Negro' golpea los mercados de EE.UU.",
            "1976 - El general argentino Jorge Rafael Videla se convierte en presidente de Argentina después de un golpe de estado.",
            "1905 - Un tren de pasajeros se descarrila en EE.UU., matando a 125 personas.",
            "1991 - El 'Lunes Negro' provoca una caída del 22% en el mercado de valores de EE.UU.",
            "1998 - 'El Gran Incendio de Singapur' destruye 1,500 edificios.",
          ],
          25: [
            "1957 - El presidente de EE.UU. Dwight D. Eisenhower envía tropas federales a Little Rock, Arkansas, para proteger a estudiantes afroamericanos que se matricularon en una escuela pública.",
            "1980 - Irak invade Irán, comenzando la Guerra Irán-Irak.",
            "1976 - El general argentino Jorge Rafael Videla se convierte en presidente de Argentina después de un golpe de estado.",
            "1905 - Un tren de pasajeros se descarrila en EE.UU., matando a 125 personas.",
            "1991 - El 'Lunes Negro' provoca una caída del 22% en el mercado de valores de EE.UU.",
            "1998 - 'El Gran Incendio de Singapur' destruye 1,500 edificios.",
          ],
          26: [
            "1960 - El primer debate presidencial televisado de EE.UU. tiene lugar entre John F. Kennedy y Richard Nixon.",
            "1983 - Stanislav Petrov de la Unión Soviética evita una posible guerra nuclear al ignorar una alerta de ataque de misiles.",
            "1957 - La 'Carga de los Cien' de la caballería de EE.UU. se lleva a cabo en la batalla de Antietam.",
            "1969 - El programa de televisión 'El Show de los Muppets' se emite por primera vez en EE.UU.",
            "1976 - Se funda el 'Club Atlético de Madrid' en España.",
            "1988 - El primer episodio de 'El Show de los Muppets' se emite en EE.UU.",
          ],
          27: [
            "1998 - El motor de búsqueda de Google sale de su fase beta.",
            "1908 - La primera línea de producción del Ford Modelo T comienza.",
            "1821 - El Imperio Mexicano se proclama en México.",
            "1979 - El primer servicio de metro de Toronto se inaugura.",
            "1985 - 'El Gran Incendio de la Ciudad de México' destruye la mayor parte del centro de la ciudad.",
            "1991 - La primera versión del sistema operativo Linux, 'Linux 0.01', se lanza públicamente.",
          ],
          28: [
            "1928 - Alexander Fleming descubre la penicilina.",
            "1924 - El primer vuelo alrededor del mundo se completa.",
            "1976 - La banda de rock 'Led Zeppelin' lanza su sexto álbum de estudio, 'Presence'.",
            "1981 - La 'Ley de la Independencia' de Belice entra en vigor.",
            "1985 - Un terremoto de 8.1 en la escala de Richter golpea la Ciudad de México.",
          ],
          29: [
            "1913 - Rudolf Diesel, el inventor del motor diésel, desaparece de un ferry en el Canal de la Mancha.",
            "1902 - El primer largometraje, 'Un Viaje a la Luna', se estrena en Francia.",
            "1950 - El Ejército Popular de Liberación de China se crea.",
            "1972 - La 'Carga de los 100' de la caballería de EE.UU. se lleva a cabo en la batalla de Antietam.",
            "1991 - El 'Lunes Negro' provoca una caída del 22% en el mercado de valores de EE.UU.",
          ],
          30: [
            "1938 - Se firma el Acuerdo de Múnich, permitiendo a Alemania anexar los Sudetes de Checoslovaquia.",
            "1955 - El actor James Dean fallece en un accidente automovilístico.",
            "1966 - Botsuana se independiza del Reino Unido.",
            "1997 - 'El Gran Incendio de Singapur' destruye 1,500 edificios.",
            "1988 - La banda de rock 'Led Zeppelin' lanza su sexto álbum de estudio, 'Presence'.",
          ],
        },
      };

      const dailyFacts =
        mockFactsData[month] && mockFactsData[month][day]
          ? mockFactsData[month][day]
          : ["No hay hechos históricos registrados para esta fecha."];

      facts.push({
        date: `${day}/${month}`,
        facts: dailyFacts,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }
    return facts;
  },
};

export default HistoricalFactService;
