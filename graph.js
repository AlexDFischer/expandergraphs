function getOrder()
{
  return document.getElementById("entriesBody").getElementsByTagName("tr").length - 1;
}
function updateEntriesTable()
{
  order = Number(document.getElementById("orderInput").value);
  var tableHTML = "";
  tableHTML += "<tr><td></td>\n";
  for (var i = 0; i < order; i++)
  {
    tableHTML += "\t<td>" + i + "</td>\n";
  }
  tableHTML += "</tr>\n";
  for (var i = 0; i < order; i++)
  {
    tableHTML += "<tr>\n\t<td>" + i + "</td>\n";
    for (var j = 0; j < order; j++)
    {
      tableHTML += "\t<td><input onchange=\"javascript:onEntryChange(" + i + ", " + j + ");\" class=\"entryInput\" type=\"checkbox\"></td>\n";
    }
    tableHTML += "</tr>\n";
  }
  document.getElementById("entriesBody").innerHTML = tableHTML;
}
function onEntryChange(i, j)
{
  var checkBox1 = document.getElementsByClassName("entryInput")[i*getOrder()+j];
  var checkBox2 = document.getElementsByClassName("entryInput")[j*getOrder()+i];
  checkBox2.checked = checkBox1.checked;
}
function getEntry(i, j)
{
  return document.getElementsByClassName("entryInput")[i*getOrder()+j].checked;
}
function setEntry(i, j, val)
{
  var checkBox = document.getElementsByClassName("entryInput")[i*getOrder()+j];
  checkBox.checked = val;
}
function matrixFromTable()
{
  var matrix = Array(getOrder());
  for (var i = 0; i < getOrder(); i++)
  {
    matrix[i] = Array(getOrder());
    for (var j = 0; j < getOrder(); j++)
    {
      matrix[i][j] = getEntry(i, j) ? 1 : 0;
    }
  }
  return matrix;
}
function maxDegree(A)
{
  var maxDeg = 0;
  for (var i = 0; i < A.length; i++)
  {
    var deg = 0;
    for (var j = 0; j < A[0].length; j++)
    {
      deg += A[i][j];
    }
    maxDeg = deg > maxDeg ? deg : maxDeg;
  }
  return maxDeg;
}
function subsetsSizeLeqHalf(total)
{
  var subsets = [[]];
  for (var i = 0; i < total.length; i++)
  {
    var oldLength = subsets.length;
    for (var j = 0; j < oldLength; j++)
    {
      if (2 * (subsets[j].length + 1) <= total.length)
      {
        var newSubset = subsets[j].slice();
        newSubset.push(total[i]);
        subsets.push(newSubset);
      }
    }
  }
  return subsets;
}
function cheegerConstant(A)
{
  var vertexSet = [];
  for (var i = 0; i < A.length; i++)
  {
    vertexSet.push(i);
  }
  var subsets = subsetsSizeLeqHalf(vertexSet);
  for (var i = 0; i < subsets.length; i++)
  {
    //    console.log(subsets[i]);
  }
  var minC = 1 / 0;
  for (var i = 0; i < subsets.length; i++)
  {
    if (subsets[i].length > 0)
    {
      var c = numEdgesAwayFrom(A, subsets[i]) / subsets[i].length;
      minC = minC < c ? minC : c;
      // console.log("for i = " + i + ", c = " + c);
    }
  }
  return minC;
}
function numEdgesAwayFrom(A, subset)
{
  var count = 0;
  for (var i = 0; i < A.length; i++)
  {
    for (var j = 0; j < A[0].length; j++)
    {
      if (A[i][j])
      {
        if (subset.indexOf(i) != -1 && subset.indexOf(j) == -1)
        {
          count++;
        }
      }
    }
  }
  return count;
}
function randomGraph(numEdges)
{
  for (var i = 0; i < getOrder(); i++)
  {
    for (var j = 0; j < getOrder(); j++)
    {
      setEntry(i, j, false);
    }
  }
  for (var edge = 0; edge < numEdges; edge++)
  {
    var i, j;
    do
    {
      i = Math.floor(getOrder() * Math.random());
      j = Math.floor(getOrder() * Math.random());
    } while (i == j || getEntry(i, j));
    setEntry(i, j, true);
    onEntryChange(i, j);
  }
}
function calculate()
{
  var matrix = matrixFromTable();
  document.getElementById("maxDegree").innerHTML = "" + maxDegree(matrix);
  document.getElementById("cheegerConstant").innerHTML = "" + cheegerConstant(matrix);
}
function randomPairing(n)
{
  var pairs = [];
  var chosen = Array(n);
  for (var i = 0; i < chosen.length; i++)
  {
    chosen[i] = false;
  }
  for (var i = 0; i < chosen.length / 2; i++)
  {
    var p1, p1;
    do
    {
      p1 = Math.floor(Math.random() * n);
    } while (chosen[p1]);
    chosen[p1] = true;
    do
    {
      p2 = Math.floor(Math.random() * n);
    } while (chosen[p2]);
    chosen[p2] = true;
    pairs.push([p1,p2]);
  }
  return pairs;
}
function adjacencyMatrixFromPairs(pairs, order, degree)
{
  var adjMat = Array(order);
  for (var i = 0; i < order; i++)
  {
    adjMat[i] = Array(order);
    for (var j = 0; j < order; j++)
    {
      adjMat[i][j] = 0;
    }
  }
  for (var i = 0; i < pairs.length; i++)
  {
    var v1 = Math.floor(pairs[i][0] / degree);
    var v2 = Math.floor(pairs[i][1] / degree);
    adjMat[v1][v2]++;
    adjMat[v2][v1]++;
  }
  return adjMat;
}
function isSimple(adjMat)
{
  for (var i = 0; i < adjMat.length; i++)
  {
    if (adjMat[i][i] != 0)
    {
      return false;
    }
  }
  for (var i = 0; i < adjMat.length; i++)
  {
    for (var j = i + 1; j < adjMat.length; j++)
    {
      if (adjMat[i][j] > 1 || adjMat[j][i] > 1)
      {
        return false;
      }
    }
  }
  return true;
}
function pairingModelDemo()
{
  var pairs, adjMat, count = 0, order = getOrder(), degree = Number(document.getElementById("degree").value);
  do {
    pairs = randomPairing(order * degree);
    adjMat = adjacencyMatrixFromPairs(pairs, order, degree);
    count++;
  } while (!isSimple(adjMat));
  for (var i = 0; i < adjMat.length; i++)
  {
    for (var j = 0; j < adjMat.length; j++)
    {
      setEntry(i, j, adjMat[i][j] == 1);
    }
  }
  return count;
}
function pairingModelTrials()
{
  var totalAttempts = 0, numTrials = 1000;
  for (var i = 0; i < numTrials; i++)
  {
    totalAttempts += pairingModelDemo();
  }
  document.getElementById("avgNumAttempts").innerHTML = totalAttempts / numTrials;
}
