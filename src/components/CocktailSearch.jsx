import { useState, useEffect } from 'react';
import axios from 'axios';
import cocktailImage from '/coctel.png';

function CocktailSearch() {
  const [cocktailName, setCocktailName] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all'); // Valor predeterminado
  const [cocktails, setCocktails] = useState([]);
  const [selectedCocktail, setSelectedCocktail] = useState(null);

  useEffect(() => {
    const loadInitialCocktails = async () => {
      try {
        const response = await axios.get(
          'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita'
        );

        const data = response.data.drinks;
        setCocktails(data);
      } catch (error) {
        console.error('Error al cargar cócteles iniciales:', error);
      }
    };

    loadInitialCocktails();
  }, []);

  const searchCocktail = async () => {
    try {
      let apiUrl = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + cocktailName;

      if (selectedFilter === 'alcoholic') {
        apiUrl = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Alcoholic';
      } else if (selectedFilter === 'nonalcoholic') {
        apiUrl = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic';
      } else if (selectedFilter !== 'all') {
        apiUrl = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${selectedFilter}`;
      }

      const response = await axios.get(apiUrl);

      const data = response.data.drinks;
      setCocktails(data);
    } catch (error) {
      console.error('Error al buscar cócteles:', error);
    }
  };

  const showIngredients = (cocktail) => {
    setSelectedCocktail(cocktail);
  };

  const closeIngredients = () => {
    setSelectedCocktail(null);
  };

  return (
    <div className='bg-yellow-200'>
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-center mt-1">
      <img src={cocktailImage} alt="coctel" className="w-12 h-19" />
        <a href="./App" className="text-3xl font-bold mb-4 text-yellow-600 hover:text-yellow-400 mt-4">Coctails Mens</a>
      </div>
      <div className="flex justify-center mt-4">
        <input
          type="text"
          value={cocktailName}
          onChange={(e) => setCocktailName(e.target.value)}
          placeholder="Nombre del cóctel"
          className="w-1/4 p-2 mb-2 sm:mb-0 sm:mr-2 rounded border bg-yellow-100 hover:bg-yellow-200 border-yellow-400 hover:border-yellow-600 h-12"
        />
        <button onClick={searchCocktail} className="w-full sm:w-auto m-0.5 bg-yellow-600 text-white p-2 rounded hover:bg-yellow-700 h-11">
          Buscar Cóctel
        </button>

        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          className="w-1/8 p-2 mb-2 sm:mb-0 sm:mr-2 rounded border bg-yellow-100 hover:bg-yellow-200 border-yellow-400 hover:border-yellow-600 h-12"
        >
          <option value="all">Todos</option>
          <option value="alcoholic">Con Alcohol</option>
          <option value="nonalcoholic">Sin Alcohol</option>
          {/* Agrega más opciones */}
        </select>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cocktails &&
          cocktails.map((cocktail) => (
            <div
              key={cocktail.idDrink}
              className="bg-yellow-100 p-4 rounded shadow cursor-pointer hover:bg-yellow-300 transition duration-300"
              onClick={() => showIngredients(cocktail)}
            >
              <h3 className="flex justify-center text-2xl font-bold mb-2 text-yellow-500">{cocktail.strDrink}</h3>
              <img
                src={cocktail.strDrinkThumb}
                alt={cocktail.strDrink}
                className="w-full"
              />
            </div>
          ))}
      </div>

      {selectedCocktail && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-yellow-200 p-4 rounded shadow max-w-md">
            <h2 className="text-xl font-bold mb-2 text-yellow-600">
              Ingredientes de {selectedCocktail.strDrink}
            </h2>
            <ul className="list-disc pl-4 text-yellow-600">
              {Object.keys(selectedCocktail)
                .filter((key) => key.startsWith('strIngredient') && selectedCocktail[key])
                .map((key) => (
                  <li key={key}>{selectedCocktail[key]}</li>
                ))}
            </ul>
            <div className="flex justify-center mt-4">
              <button onClick={closeIngredients} className="p-2 bg-yellow-600 text-white rounded hover:bg-yellow-700">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}

export default CocktailSearch;
