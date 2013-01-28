#pragma strict

public var Health : float;

function Start () {

}

function Update () {

	

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
