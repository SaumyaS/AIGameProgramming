#pragma strict

public var Health : float;
public var hitOwner : GameObject = null;
function Start () {

}

function Update () {
	/*if( hitOwner != null ) 
	{
		var isFound : boolean = false;
		var Colliders : Collider[];
		var currLayer : int = gameObject.layer;
		gameObject.layer = 0;
		Colliders = Physics.OverlapSphere(hitOwner.transform.position, 4, 1);
		gameObject.layer = currLayer;
		for(var i : int = 0; i<=Colliders.length-1; i++)
		{
			var otherObject : GameObject = Colliders[i].gameObject;
			if( otherObject == gameObject )
			{
				isFound = true;
			}
		}
		if( isFound == false )
		{
			gameObject.layer = 0;
			hitOwner = null;
		}
	}*/
	gameObject.layer = 0;
}

/*function DamageTaken(amount : float)
{
	Health -= 25;
		
	if(Health <= 0.0f)
	{
		Destroy(gameObject);
	}
}*/



function OnTriggerEnter(other : Collider) 
{
	if(other.gameObject.tag == "Bullet")
	{
		Health -= 25;
		
		if(Health <= 0.0f)
		{
			Destroy(gameObject);
		}
		
		Destroy(other.gameObject);
	}
    
}
